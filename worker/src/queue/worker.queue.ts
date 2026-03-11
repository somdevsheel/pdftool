import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES, JOB_TYPES } from './constants';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';
import { processMerge } from '../processors/merge.processor';
import { processSplit } from '../processors/split.processor';
import { processCompress } from '../processors/compress.processor';
import { processRotate } from '../processors/rotate.processor';
import { processConvert } from '../processors/convert.processor';
import { processEdit } from '../processors/edit.processor';
import { processPages } from '../processors/pages.processor';
import { processPdfToImg } from '../processors/pdf-to-img.processor';
import { processOfficeToPdf } from '../processors/office-to-pdf.processor';
import { processPdfToOffice } from '../processors/pdf-to-office.processor';
import { processProtect } from '../processors/protect.processor';
import { processInsertPages } from '../processors/insert-pages.processor';
import { processNumberPages } from '../processors/number-pages.processor';
import { processCrop } from '../processors/crop.processor';

export function createWorker(
  redisConnection: { host: string; port: number; password?: string },
  commandService: CommandService,
  fileService: FileService,
  concurrency = 4,
): Worker {
  const worker = new Worker(
    QUEUE_NAMES.PDF_PROCESSING,
    async (job: Job) => {
      console.log(`[Worker] Processing job ${job.id} type=${job.name}`);
      switch (job.name) {
        case JOB_TYPES.MERGE:          return processMerge(job as any, commandService, fileService);
        case JOB_TYPES.SPLIT:          return processSplit(job as any, commandService, fileService);
        case JOB_TYPES.COMPRESS:       return processCompress(job as any, commandService, fileService);
        case JOB_TYPES.ROTATE:         return processRotate(job as any, commandService, fileService);
        case JOB_TYPES.CONVERT:        return processConvert(job as any, commandService, fileService);
        case JOB_TYPES.EDIT:           return processEdit(job as any, fileService);
        case JOB_TYPES.PAGES:          return processPages(job as any, commandService, fileService);
        case JOB_TYPES.PDF_TO_IMG:     return processPdfToImg(job as any, commandService, fileService);
        case JOB_TYPES.OFFICE_TO_PDF:  return processOfficeToPdf(job as any, commandService, fileService);
        case JOB_TYPES.PDF_TO_OFFICE:  return processPdfToOffice(job as any, commandService, fileService);
        case JOB_TYPES.PROTECT:        return processProtect(job as any, commandService, fileService);
        case JOB_TYPES.INSERT_PAGES:   return processInsertPages(job as any, commandService, fileService);
        case JOB_TYPES.NUMBER_PAGES:   return processNumberPages(job as any, commandService, fileService);
        case JOB_TYPES.CROP:           return processCrop(job as any, commandService, fileService);
        default: throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    { connection: redisConnection, concurrency, limiter: { max: 100, duration: 60_000 } },
  );
  worker.on('completed', (job) => console.log(`[Worker] Job ${job.id} [${job.name}] completed`));
  worker.on('failed', (job, err) => console.error(`[Worker] Job ${job?.id} [${job?.name}] failed: ${err.message}`));
  worker.on('error', (err) => console.error('[Worker] Error:', err));
  return worker;
}