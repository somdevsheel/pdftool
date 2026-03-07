// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';
// import { ConfigService } from '@nestjs/config';
// import { v4 as uuidv4 } from 'uuid';
// import { DocumentsService } from '../documents/documents.service';
// import { QUEUE_NAMES, JOB_TYPES } from '../../common/constants';
// import {
//   MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto,
//   ConvertJobDto, EditJobDto, PagesJobDto,
//   PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
// } from '../../common/dto/job.dto';
// import { buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';

// function bullStateToStatus(state: string): string {
//   switch (state) {
//     case 'active':    return 'PROCESSING';
//     case 'completed': return 'COMPLETED';
//     case 'failed':    return 'FAILED';
//     default:          return 'PENDING';
//   }
// }

// @Injectable()
// export class JobsService {
//   private readonly logger = new Logger(JobsService.name);

//   constructor(
//     @InjectQueue(QUEUE_NAMES.PDF_PROCESSING) private readonly processingQueue: Queue,
//     private readonly documentsService: DocumentsService,
//     private readonly configService: ConfigService,
//   ) {}

//   private getOutputDir(): string {
//     const dir = this.configService.get<string>('storage.outputDir');
//     ensureDirectoryExists(dir);
//     return dir;
//   }

//   async getJob(jobId: string) {
//     const meta = this.documentsService.getJob(jobId);
//     const bullJob = await this.processingQueue.getJob(jobId);
//     if (!bullJob) return meta;

//     const state = await bullJob.getState();
//     const status = bullStateToStatus(state);
//     const returnValue = bullJob.returnvalue as any;

//     // Use returnvalue outputPath if present, otherwise keep meta.outputPath
//     const outputPath = returnValue?.outputPath || meta.outputPath;
//     const error = bullJob.failedReason || meta.error;

//     return {
//       ...meta,
//       status,
//       progress: status === 'COMPLETED' ? 100 : ((bullJob as any)._progress ?? 0),
//       outputPath,
//       error,
//     };
//   }

//   getAllJobs() { return this.documentsService.getAllJobs(); }

//   // ─── helpers ──────────────────────────────────────────────────────────────

//   private async enqueue(type: string, jobId: string, outputPath: string, data: object, inputFileIds: string[], metadata: object = {}) {
//     this.documentsService.createJob({ id: jobId, type, status: 'PENDING', inputFileIds, outputPath, metadata });
//     await this.processingQueue.add(type, { jobId, type, outputPath, ...data }, { jobId });
//     this.logger.log(`Queued ${type} job: ${jobId}`);
//     return this.getJob(jobId);
//   }

//   // ─── job creators ─────────────────────────────────────────────────────────

//   async createMergeJob(dto: MergeJobDto) {
//     const files = dto.fileIds.map(id => this.documentsService.getFile(id));
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.MERGE, jobId, outputPath,
//       { inputPaths: files.map(f => f.path) }, dto.fileIds);
//   }

//   async createSplitJob(dto: SplitJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.SPLIT, jobId, outputPath,
//       { inputPath: file.path, pages: dto.pages }, [dto.fileId], { pages: dto.pages });
//   }

//   async createCompressJob(dto: CompressJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const quality = dto.quality || 'medium';
//     return this.enqueue(JOB_TYPES.COMPRESS, jobId, outputPath,
//       { inputPath: file.path, quality }, [dto.fileId], { quality });
//   }

//   async createRotateJob(dto: RotateJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const degrees = dto.degrees || 90;
//     return this.enqueue(JOB_TYPES.ROTATE, jobId, outputPath,
//       { inputPath: file.path, degrees, pages: dto.pages }, [dto.fileId], { degrees });
//   }

//   async createConvertJob(dto: ConvertJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.CONVERT, jobId, outputPath,
//       { inputPath: file.path }, [dto.fileId]);
//   }

//   async createEditJob(dto: EditJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const instructions = dto.instructions || [];
//     return this.enqueue(JOB_TYPES.EDIT, jobId, outputPath,
//       { inputPath: file.path, instructions }, [dto.fileId], { instructions });
//   }

//   async createPagesJob(dto: PagesJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.PAGES, jobId, outputPath,
//       { inputPath: file.path, operation: dto.operation, pages: dto.pages },
//       [dto.fileId], { operation: dto.operation, pages: dto.pages });
//   }

//   async createPdfToImgJob(dto: PdfToImgJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const format = dto.format || 'jpg';
//     const dpi = dto.dpi || 150;
//     return this.enqueue(JOB_TYPES.PDF_TO_IMG, jobId, outputPath,
//       { inputPath: file.path, format, dpi }, [dto.fileId], { format, dpi });
//   }

//   async createOfficeToPdfJob(dto: OfficeToPdfJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.OFFICE_TO_PDF, jobId, outputPath,
//       { inputPath: file.path }, [dto.fileId]);
//   }

//   async createPdfToOfficeJob(dto: PdfToOfficeJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.PDF_TO_OFFICE, jobId, outputPath,
//       { inputPath: file.path, format: dto.format }, [dto.fileId], { format: dto.format });
//   }
// }










// import { Injectable, Logger } from '@nestjs/common';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';
// import { ConfigService } from '@nestjs/config';
// import { v4 as uuidv4 } from 'uuid';
// import { DocumentsService } from '../documents/documents.service';
// import { QUEUE_NAMES, JOB_TYPES } from '../../common/constants';
// import {
//   MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto,
//   ConvertJobDto, EditJobDto, PagesJobDto,
//   PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
// } from '../../common/dto/job.dto';
// import { buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';

// function bullStateToStatus(state: string): string {
//   switch (state) {
//     case 'active':    return 'PROCESSING';
//     case 'completed': return 'COMPLETED';
//     case 'failed':    return 'FAILED';
//     default:          return 'PENDING';
//   }
// }

// @Injectable()
// export class JobsService {
//   private readonly logger = new Logger(JobsService.name);

//   constructor(
//     @InjectQueue(QUEUE_NAMES.PDF_PROCESSING) private readonly processingQueue: Queue,
//     private readonly documentsService: DocumentsService,
//     private readonly configService: ConfigService,
//   ) {}

//   private getOutputDir(): string {
//     const dir = this.configService.get<string>('storage.outputDir');
//     ensureDirectoryExists(dir);
//     return dir;
//   }

//   async getJob(jobId: string) {
//     const meta = this.documentsService.getJob(jobId);
//     const bullJob = await this.processingQueue.getJob(jobId);
//     if (!bullJob) return meta;
//     const state = await bullJob.getState();
//     const status = bullStateToStatus(state);
//     const returnValue = bullJob.returnvalue as any;
//     const outputPath = returnValue?.outputPath || meta.outputPath;
//     const error = bullJob.failedReason || meta.error;
//     return {
//       ...meta, status,
//       progress: status === 'COMPLETED' ? 100 : ((bullJob as any)._progress ?? 0),
//       outputPath, error,
//     };
//   }

//   getAllJobs() { return this.documentsService.getAllJobs(); }

//   private async enqueue(type: string, jobId: string, outputPath: string, data: object, inputFileIds: string[], metadata: object = {}) {
//     this.documentsService.createJob({ id: jobId, type, status: 'PENDING', inputFileIds, outputPath, metadata });
//     await this.processingQueue.add(type, { jobId, type, outputPath, ...data }, { jobId });
//     this.logger.log(`Queued ${type} job: ${jobId}`);
//     return this.getJob(jobId);
//   }

//   async createMergeJob(dto: MergeJobDto) {
//     const files = dto.fileIds.map((id) => this.documentsService.getFile(id));
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.MERGE, jobId, outputPath,
//       { inputPaths: files.map((f) => f.path) }, dto.fileIds);
//   }

//   async createSplitJob(dto: SplitJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.SPLIT, jobId, outputPath,
//       { inputPath: file.path, pages: dto.pages }, [dto.fileId], { pages: dto.pages });
//   }

//   async createCompressJob(dto: CompressJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const quality = dto.quality || 'medium';
//     return this.enqueue(JOB_TYPES.COMPRESS, jobId, outputPath,
//       { inputPath: file.path, quality }, [dto.fileId], { quality });
//   }

//   async createRotateJob(dto: RotateJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const degrees = dto.degrees || 90;
//     return this.enqueue(JOB_TYPES.ROTATE, jobId, outputPath,
//       { inputPath: file.path, degrees, pages: dto.pages }, [dto.fileId], { degrees });
//   }

//   async createConvertJob(dto: ConvertJobDto) {
//     // Support both multi-file (fileIds) and single-file (fileId) uploads
//     const fileIds = dto.fileIds?.length ? dto.fileIds : (dto.fileId ? [dto.fileId] : []);
//     const files = fileIds.map((id) => this.documentsService.getFile(id));
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.CONVERT, jobId, outputPath,
//       { inputPaths: files.map((f) => f.path) }, fileIds);
//   }

//   async createEditJob(dto: EditJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const instructions = dto.instructions || [];
//     return this.enqueue(JOB_TYPES.EDIT, jobId, outputPath,
//       { inputPath: file.path, instructions }, [dto.fileId], { instructions });
//   }

//   async createPagesJob(dto: PagesJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.PAGES, jobId, outputPath,
//       { inputPath: file.path, operation: dto.operation, pages: dto.pages },
//       [dto.fileId], { operation: dto.operation, pages: dto.pages });
//   }

//   async createPdfToImgJob(dto: PdfToImgJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     const format = dto.format || 'jpg';
//     const dpi = dto.dpi || 150;
//     return this.enqueue(JOB_TYPES.PDF_TO_IMG, jobId, outputPath,
//       { inputPath: file.path, format, dpi }, [dto.fileId], { format, dpi });
//   }

//   async createOfficeToPdfJob(dto: OfficeToPdfJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.OFFICE_TO_PDF, jobId, outputPath,
//       { inputPath: file.path }, [dto.fileId]);
//   }

//   async createPdfToOfficeJob(dto: PdfToOfficeJobDto) {
//     const file = this.documentsService.getFile(dto.fileId);
//     const jobId = uuidv4();
//     const outputPath = buildFilePath(this.getOutputDir(), jobId);
//     return this.enqueue(JOB_TYPES.PDF_TO_OFFICE, jobId, outputPath,
//       { inputPath: file.path, format: dto.format }, [dto.fileId], { format: dto.format });
//   }
// }





import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from '../documents/documents.service';
import { QUEUE_NAMES, JOB_TYPES } from '../../common/constants';
import {
  MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto,
  ConvertJobDto, EditJobDto, PagesJobDto,
  PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
  ProtectJobDto, InsertPagesJobDto, NumberPagesJobDto, CropJobDto,
} from '../../common/dto/job.dto';
import { buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';

function bullStateToStatus(state: string): string {
  switch (state) {
    case 'active':    return 'PROCESSING';
    case 'completed': return 'COMPLETED';
    case 'failed':    return 'FAILED';
    default:          return 'PENDING';
  }
}

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

  async getJob(jobId: string) {
    const meta = this.documentsService.getJob(jobId);
    const bullJob = await this.processingQueue.getJob(jobId);
    if (!bullJob) return meta;
    const state = await bullJob.getState();
    const status = bullStateToStatus(state);
    const returnValue = bullJob.returnvalue as any;
    const outputPath = returnValue?.outputPath || meta.outputPath;
    const error = bullJob.failedReason || meta.error;
    return { ...meta, status, progress: status === 'COMPLETED' ? 100 : ((bullJob as any)._progress ?? 0), outputPath, error };
  }

  getAllJobs() { return this.documentsService.getAllJobs(); }

  private async enqueue(type: string, jobId: string, outputPath: string, data: object, inputFileIds: string[], metadata: object = {}) {
    this.documentsService.createJob({ id: jobId, type, status: 'PENDING', inputFileIds, outputPath, metadata });
    await this.processingQueue.add(type, { jobId, type, outputPath, ...data }, { jobId });
    this.logger.log(`Queued ${type} job: ${jobId}`);
    return this.getJob(jobId);
  }

  async createMergeJob(dto: MergeJobDto) {
    const files = dto.fileIds.map(id => this.documentsService.getFile(id));
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.MERGE, jobId, outputPath, { inputPaths: files.map(f => f.path) }, dto.fileIds);
  }
  async createSplitJob(dto: SplitJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.SPLIT, jobId, outputPath, { inputPath: file.path, pages: dto.pages }, [dto.fileId]);
  }
  async createCompressJob(dto: CompressJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.COMPRESS, jobId, outputPath, { inputPath: file.path, quality: dto.quality||'medium' }, [dto.fileId]);
  }
  async createRotateJob(dto: RotateJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.ROTATE, jobId, outputPath, { inputPath: file.path, degrees: dto.degrees||90, pages: dto.pages }, [dto.fileId]);
  }
  async createConvertJob(dto: ConvertJobDto) {
    const fileIds = dto.fileIds?.length ? dto.fileIds : (dto.fileId ? [dto.fileId] : []);
    const files = fileIds.map(id => this.documentsService.getFile(id));
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.CONVERT, jobId, outputPath, { inputPaths: files.map(f => f.path) }, fileIds);
  }
  async createEditJob(dto: EditJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.EDIT, jobId, outputPath, { inputPath: file.path, instructions: dto.instructions||[] }, [dto.fileId]);
  }
  async createPagesJob(dto: PagesJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.PAGES, jobId, outputPath, { inputPath: file.path, operation: dto.operation, pages: dto.pages }, [dto.fileId]);
  }
  async createPdfToImgJob(dto: PdfToImgJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.PDF_TO_IMG, jobId, outputPath, { inputPath: file.path, format: dto.format||'jpg', dpi: dto.dpi||150 }, [dto.fileId]);
  }
  async createOfficeToPdfJob(dto: OfficeToPdfJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.OFFICE_TO_PDF, jobId, outputPath, { inputPath: file.path }, [dto.fileId]);
  }
  async createPdfToOfficeJob(dto: PdfToOfficeJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.PDF_TO_OFFICE, jobId, outputPath, { inputPath: file.path, format: dto.format }, [dto.fileId]);
  }
  async createProtectJob(dto: ProtectJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.PROTECT, jobId, outputPath, { inputPath: file.path, userPassword: dto.userPassword, ownerPassword: dto.ownerPassword }, [dto.fileId]);
  }
  async createInsertPagesJob(dto: InsertPagesJobDto) {
    const base = this.documentsService.getFile(dto.baseFileId);
    const insert = this.documentsService.getFile(dto.insertFileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.INSERT_PAGES, jobId, outputPath, { basePath: base.path, insertPath: insert.path, afterPage: dto.afterPage }, [dto.baseFileId, dto.insertFileId]);
  }
  async createNumberPagesJob(dto: NumberPagesJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.NUMBER_PAGES, jobId, outputPath, { inputPath: file.path, position: dto.position||'bottom-center', startNumber: dto.startNumber||1, fontSize: dto.fontSize||12 }, [dto.fileId]);
  }
  async createCropJob(dto: CropJobDto) {
    const file = this.documentsService.getFile(dto.fileId);
    const jobId = uuidv4(); const outputPath = buildFilePath(this.getOutputDir(), jobId);
    return this.enqueue(JOB_TYPES.CROP, jobId, outputPath, { inputPath: file.path, top: dto.top, bottom: dto.bottom, left: dto.left, right: dto.right }, [dto.fileId]);
  }
}