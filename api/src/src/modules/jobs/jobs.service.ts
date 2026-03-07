import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from '../documents/documents.service';
import { QUEUE_NAMES, JOB_TYPES } from '../../common/constants';
import {
  MergeJobDto,
  SplitJobDto,
  CompressJobDto,
  RotateJobDto,
  EditJobDto,
  PagesJobDto,
} from '../../common/dto/job.dto';
import { buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';

// Maps Bull job states to our status strings
function bullStateToStatus(state: string): string {
  switch (state) {
    case 'active':     return 'PROCESSING';
    case 'completed':  return 'COMPLETED';
    case 'failed':     return 'FAILED';
    case 'waiting':
    case 'delayed':
    default:           return 'PENDING';
  }
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.PDF_PROCESSING)
    private readonly processingQueue: Queue,
    private readonly documentsService: DocumentsService,
    private readonly configService: ConfigService,
  ) {}

  private getOutputDir(): string {
    const dir = this.configService.get<string>('storage.outputDir');
    ensureDirectoryExists(dir);
    return dir;
  }

  async createMergeJob(dto: MergeJobDto) {
    const files = dto.fileIds.map((id) => this.documentsService.getFile(id));
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    // Register in memory so we can look up file metadata
    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.MERGE,
      status: 'PENDING',
      inputFileIds: dto.fileIds,
      outputPath,
      metadata: {},
    });

    await this.processingQueue.add(
      JOB_TYPES.MERGE,
      { jobId, type: JOB_TYPES.MERGE, inputPaths: files.map((f) => f.path), outputPath },
      { jobId },
    );

    this.logger.log(`Queued merge job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createSplitJob(dto: SplitJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.SPLIT,
      status: 'PENDING',
      inputFileIds: [dto.fileId],
      outputPath,
      metadata: { pages: dto.pages },
    });

    await this.processingQueue.add(
      JOB_TYPES.SPLIT,
      { jobId, type: JOB_TYPES.SPLIT, inputPath: file.path, outputPath, pages: dto.pages },
      { jobId },
    );

    this.logger.log(`Queued split job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createCompressJob(dto: CompressJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.COMPRESS,
      status: 'PENDING',
      inputFileIds: [dto.fileId],
      outputPath,
      metadata: { quality: dto.quality || 'medium' },
    });

    await this.processingQueue.add(
      JOB_TYPES.COMPRESS,
      { jobId, type: JOB_TYPES.COMPRESS, inputPath: file.path, outputPath, quality: dto.quality || 'medium' },
      { jobId },
    );

    this.logger.log(`Queued compress job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createRotateJob(dto: RotateJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.ROTATE,
      status: 'PENDING',
      inputFileIds: [dto.fileId],
      outputPath,
      metadata: { degrees: dto.degrees || 90 },
    });

    await this.processingQueue.add(
      JOB_TYPES.ROTATE,
      { jobId, type: JOB_TYPES.ROTATE, inputPath: file.path, outputPath, degrees: dto.degrees || 90, pages: dto.pages },
      { jobId },
    );

    this.logger.log(`Queued rotate job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createEditJob(dto: EditJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.EDIT,
      status: 'PENDING',
      inputFileIds: [dto.fileId],
      outputPath,
      metadata: { instructions: dto.instructions || [] },
    });

    await this.processingQueue.add(
      JOB_TYPES.EDIT,
      { jobId, type: JOB_TYPES.EDIT, inputPath: file.path, outputPath, instructions: dto.instructions || [] },
      { jobId },
    );

    this.logger.log(`Queued edit job: ${jobId}`);
    return this.getJob(jobId);
  }

  // ─── Read job status DIRECTLY from Bull/Redis ──────────────────────────────
  // This works across separate API and Worker processes because Bull stores
  // all job state in Redis — no shared memory needed.

  async getJob(jobId: string) {
    // Get our metadata from in-memory store (type, inputFileIds, outputPath)
    const meta = this.documentsService.getJob(jobId);

    // Get live status from Bull queue via Redis
    const bullJob = await this.processingQueue.getJob(jobId);

    if (!bullJob) {
      // Job not in Bull yet or was cleaned up — return metadata as-is
      return meta;
    }

    const state = await bullJob.getState();
    const status = bullStateToStatus(state);

    // Get progress (0-100)
    const progress = typeof bullJob.progress === 'function'
      ? await (bullJob as any).progress()
      : (bullJob as any)._progress ?? 0;

    // Get output path from Bull returnvalue if completed
    const returnValue = bullJob.returnvalue as any;
    const outputPath = returnValue?.outputPath || meta.outputPath;

    // Get error if failed
    const error = bullJob.failedReason || meta.error;

    return {
      ...meta,
      status,
      progress: status === 'COMPLETED' ? 100 : (progress || 0),
      outputPath,
      error,
    };
  }

  async createPagesJob(dto: PagesJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const outputDir = this.getOutputDir();
    const jobId = uuidv4();
    const outputPath = buildFilePath(outputDir, jobId);

    this.documentsService.createJob({
      id: jobId,
      type: JOB_TYPES.PAGES,
      status: 'PENDING',
      inputFileIds: [dto.fileId],
      outputPath,
      metadata: { operation: dto.operation, pages: dto.pages },
    });

    await this.processingQueue.add(
      JOB_TYPES.PAGES,
      {
        jobId,
        type: JOB_TYPES.PAGES,
        operation: dto.operation,
        inputPath: file.path,
        outputPath,
        pages: dto.pages,
      },
      { jobId },
    );

    this.logger.log(`Queued pages/${dto.operation} job: ${jobId}`);
    return this.getJob(jobId);
  }

  getAllJobs() {
    return this.documentsService.getAllJobs();
  }
}

