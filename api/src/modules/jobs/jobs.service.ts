import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentsService } from '../documents/documents.service';
import { QUEUE_NAMES, JOB_TYPES } from '../../common/constants';
import {
  MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto,
  ConvertJobDto, EditJobDto, PagesJobDto,
  PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
  ProtectJobDto, InsertPagesJobDto, NumberPagesJobDto, CropJobDto,
} from '../../common/dto/job.dto';
import { buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

/** What clients see. Server paths and raw tool output are never included. */
export interface JobView {
  id: string;
  type: string;
  status: JobStatus;
  progress: number;
  error?: string;
  createdAt: string;
}

function toStatus(state: string): JobStatus {
  switch (state) {
    case 'active':    return 'PROCESSING';
    case 'completed': return 'COMPLETED';
    case 'failed':    return 'FAILED';
    default:          return 'PENDING'; // waiting, delayed, prioritized, waiting-children
  }
}

// Worker errors that are already written for users (validation messages) pass through;
// tool failures ("Command failed: qpdf: /storage/…") would leak server paths and mean
// nothing to users, so they get a generic message.
function toUserError(reason?: string): string | undefined {
  if (!reason) return undefined;
  if (/^Command failed|\/storage\/|\/tmp\/|ENOENT|EACCES/i.test(reason)) {
    return 'Processing failed. The file may be damaged, password-protected or not supported.';
  }
  return reason.slice(0, 300);
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf', zip: 'application/zip', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

// Suffix appended to the user's file name, e.g. "invoice-compressed.pdf".
const NAME_SUFFIX: Record<string, string> = {
  merge: 'merged', split: 'split', compress: 'compressed', rotate: 'rotated', convert: 'converted',
  edit: 'edited', pages: 'pages', 'pdf-to-img': 'images', 'office-to-pdf': 'converted',
  'pdf-to-office': 'converted', protect: 'protected', 'insert-pages': 'combined',
  'number-pages': 'numbered', crop: 'cropped',
};

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.PDF_PROCESSING) private readonly processingQueue: Queue,
    private readonly documentsService: DocumentsService,
    private readonly configService: ConfigService,
  ) {}

  private getOutputDir(): string {
    const dir = this.configService.get<string>('storage.outputDir');
    ensureDirectoryExists(dir);
    return dir;
  }

  private async findJob(jobId: string): Promise<Job> {
    const job = await this.processingQueue.getJob(jobId);
    if (!job) throw new NotFoundException(`Job not found or expired: ${jobId}`);
    return job;
  }

  async getJob(jobId: string): Promise<JobView> {
    const job = await this.findJob(jobId);
    const status = toStatus(await job.getState());
    const progress = status === 'COMPLETED' ? 100 : typeof job.progress === 'number' ? job.progress : 0;
    return {
      id: jobId,
      type: job.name,
      status,
      progress,
      error: status === 'FAILED' ? toUserError(job.failedReason) || 'Processing failed' : undefined,
      createdAt: new Date(job.timestamp).toISOString(),
    };
  }

  /** Resolves a completed job's output file and a friendly download name. */
  async getDownload(jobId: string): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const job = await this.findJob(jobId);
    if ((await job.getState()) !== 'completed') throw new NotFoundException(`Job ${jobId} is not completed`);

    const base: string = job.returnvalue?.outputPath || job.data.outputPath || '';
    // Processors append the real extension to the base output path.
    const candidates = [base, ...Object.keys(MIME_BY_EXT).map((ext) => `${base}.${ext}`)];
    const filePath = candidates.find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
    if (!filePath) throw new NotFoundException(`Output file for job ${jobId} has expired. Please run the tool again.`);

    const ext = (path.extname(filePath).slice(1) || 'pdf').toLowerCase();
    const sourceName = path.parse(job.data.originalName || '').name;
    const stem = (sourceName || 'freenoo').replace(/[^\p{L}\p{N}._\- ]+/gu, '_').trim().slice(0, 80) || 'freenoo';
    const suffix = NAME_SUFFIX[job.name] || job.name;
    return { filePath, fileName: `${stem}-${suffix}.${ext}`, mimeType: MIME_BY_EXT[ext] || 'application/octet-stream' };
  }

  private async enqueue(type: string, data: object, inputFileIds: string[]) {
    const jobId = randomUUID();
    const outputPath = buildFilePath(this.getOutputDir(), jobId);
    const originalName = this.documentsService.getFile(inputFileIds[0]).originalName;
    await this.processingQueue.add(type, { jobId, type, outputPath, originalName, ...data }, { jobId });
    this.logger.log(`Queued ${type} job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createMergeJob(dto: MergeJobDto) {
    const files = dto.fileIds.map((id) => this.documentsService.getFile(id));
    return this.enqueue(JOB_TYPES.MERGE, { inputPaths: files.map((f) => f.path) }, dto.fileIds);
  }
  async createSplitJob(dto: SplitJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.SPLIT, { inputPath: file.path, pages: dto.pages }, [dto.fileId]);
  }
  async createCompressJob(dto: CompressJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.COMPRESS, { inputPath: file.path, quality: dto.quality || 'medium' }, [dto.fileId]);
  }
  async createRotateJob(dto: RotateJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.ROTATE, { inputPath: file.path, degrees: dto.degrees || 90, pages: dto.pages }, [dto.fileId]);
  }
  async createConvertJob(dto: ConvertJobDto) {
    const fileIds = dto.fileIds?.length ? dto.fileIds : dto.fileId ? [dto.fileId] : [];
    if (!fileIds.length) throw new NotFoundException('No files to convert');
    const files = fileIds.map((id) => this.documentsService.getFile(id));
    return this.enqueue(JOB_TYPES.CONVERT, { inputPaths: files.map((f) => f.path) }, fileIds);
  }
  async createEditJob(dto: EditJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.EDIT, { inputPath: file.path, instructions: dto.instructions || [] }, [dto.fileId]);
  }
  async createPagesJob(dto: PagesJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.PAGES, { inputPath: file.path, operation: dto.operation, pages: dto.pages }, [dto.fileId]);
  }
  async createPdfToImgJob(dto: PdfToImgJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.PDF_TO_IMG, { inputPath: file.path, format: dto.format || 'jpg', dpi: dto.dpi || 150 }, [dto.fileId]);
  }
  async createOfficeToPdfJob(dto: OfficeToPdfJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.OFFICE_TO_PDF, { inputPath: file.path }, [dto.fileId]);
  }
  async createPdfToOfficeJob(dto: PdfToOfficeJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.PDF_TO_OFFICE, { inputPath: file.path, format: dto.format }, [dto.fileId]);
  }
  async createProtectJob(dto: ProtectJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.PROTECT, { inputPath: file.path, userPassword: dto.userPassword, ownerPassword: dto.ownerPassword }, [dto.fileId]);
  }
  async createInsertPagesJob(dto: InsertPagesJobDto) {
    const base = this.documentsService.getFile(dto.baseFileId);
    const insert = this.documentsService.getFile(dto.insertFileId);
    return this.enqueue(JOB_TYPES.INSERT_PAGES, { basePath: base.path, insertPath: insert.path, afterPage: dto.afterPage }, [dto.baseFileId, dto.insertFileId]);
  }
  async createNumberPagesJob(dto: NumberPagesJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.NUMBER_PAGES, { inputPath: file.path, position: dto.position || 'bottom-center', startNumber: dto.startNumber || 1, fontSize: dto.fontSize || 12 }, [dto.fileId]);
  }
  async createCropJob(dto: CropJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    return this.enqueue(JOB_TYPES.CROP, { inputPath: file.path, top: dto.top, bottom: dto.bottom, left: dto.left, right: dto.right }, [dto.fileId]);
  }
}
