import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JOB_STATUS } from '../../common/constants';
import { deleteFile, fileExists, getFileAge } from '../../common/utils/file.util';
import * as path from 'path';

export interface FileRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: Date;
}

export interface JobRecord {
  id: string;
  type: string;
  status: keyof typeof JOB_STATUS;
  inputFileIds: string[];
  outputFileId?: string;
  outputPath?: string;
  error?: string;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private files = new Map<string, FileRecord>();
  private jobs = new Map<string, JobRecord>();

  constructor(private readonly configService: ConfigService) {}

  // ─── Files ───────────────────────────────────────────────────────────────

  registerFile(record: FileRecord): FileRecord {
    this.files.set(record.id, record);
    this.logger.log(`Registered file: ${record.id} (${record.originalName})`);
    return record;
  }

  getFile(fileId: string): FileRecord {
    const file = this.files.get(fileId);
    if (!file) throw new NotFoundException(`File not found: ${fileId}`);
    return file;
  }

  getAllFiles(): FileRecord[] {
    return Array.from(this.files.values());
  }

  deleteFileRecord(fileId: string): void {
    const file = this.files.get(fileId);
    if (file) {
      deleteFile(file.path);
      this.files.delete(fileId);
      this.logger.log(`Deleted file: ${fileId}`);
    }
  }

  // ─── Jobs ────────────────────────────────────────────────────────────────

  createJob(record: Omit<JobRecord, 'createdAt' | 'updatedAt'>): JobRecord {
    const job: JobRecord = {
      ...record,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(job.id, job);
    this.logger.log(`Created job: ${job.id} (${job.type})`);
    return job;
  }

  getJob(jobId: string): JobRecord {
    const job = this.jobs.get(jobId);
    if (!job) throw new NotFoundException(`Job not found: ${jobId}`);
    return job;
  }

  updateJob(jobId: string, updates: Partial<JobRecord>): JobRecord {
    const job = this.getJob(jobId);
    const updated = { ...job, ...updates, updatedAt: new Date() };
    this.jobs.set(jobId, updated);
    return updated;
  }

  getAllJobs(): JobRecord[] {
    return Array.from(this.jobs.values());
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  cleanExpiredFiles(): { deletedFiles: number; deletedJobs: number } {
    const expiryMinutes = this.configService.get<number>('storage.fileExpiryMinutes') || 60;
    let deletedFiles = 0;
    let deletedJobs = 0;

    for (const [id, file] of this.files.entries()) {
      try {
        if (getFileAge(file.path) > expiryMinutes) {
          deleteFile(file.path);
          this.files.delete(id);
          deletedFiles++;
        }
      } catch (err) {
        this.logger.warn(`Failed to delete file ${id}: ${err.message}`);
      }
    }

    // Clean completed/failed jobs older than expiry * 2
    const jobExpiryMs = expiryMinutes * 2 * 60 * 1000;
    for (const [id, job] of this.jobs.entries()) {
      if (
        (job.status === 'COMPLETED' || job.status === 'FAILED') &&
        Date.now() - job.createdAt.getTime() > jobExpiryMs
      ) {
        if (job.outputPath) deleteFile(job.outputPath);
        this.jobs.delete(id);
        deletedJobs++;
      }
    }

    this.logger.log(`Cleanup: removed ${deletedFiles} files, ${deletedJobs} jobs`);
    return { deletedFiles, deletedJobs };
  }
}
