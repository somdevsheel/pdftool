import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES } from '../../common/constants';
import { DocumentsService } from '../documents/documents.service';

// Use raw Bull queue event listeners instead of @nestjs/bull decorators.
// The decorator-based events (OnQueueActive etc.) only fire when THIS process
// processes the job. Since we use a separate worker process, we need to listen
// to the global Bull queue events which fire on ALL connected clients.

@Injectable()
export class JobsQueue implements OnModuleInit {
  private readonly logger = new Logger(JobsQueue.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.PDF_PROCESSING) private readonly queue: Queue,
    private readonly documentsService: DocumentsService,
  ) {}

  onModuleInit() {
    // 'global:active' fires on all Bull clients when any worker picks up a job
    this.queue.on('global:active', (jobId: string) => {
      this.queue.getJob(jobId).then((job) => {
        if (!job?.data?.jobId) return;
        this.logger.log(`Job ${jobId} [${job.name}] active`);
        try {
          this.documentsService.updateJob(job.data.jobId, {
            status: 'PROCESSING',
            progress: 10,
          });
        } catch (err) {
          this.logger.warn(`Could not update job status: ${err.message}`);
        }
      });
    });

    this.queue.on('global:progress', (jobId: string, progress: number) => {
      this.queue.getJob(jobId).then((job) => {
        if (!job?.data?.jobId) return;
        try {
          this.documentsService.updateJob(job.data.jobId, { progress });
        } catch {}
      });
    });

    this.queue.on('global:completed', (jobId: string, result: string) => {
      this.queue.getJob(jobId).then((job) => {
        if (!job?.data?.jobId) return;
        this.logger.log(`Job ${jobId} [${job.name}] completed`);
        try {
          // result is JSON-serialized by Bull
          let parsed: any = {};
          try { parsed = JSON.parse(result); } catch { parsed = result || {}; }
          const upd: any = { status: 'COMPLETED', progress: 100 };
          if (parsed?.outputPath) upd.outputPath = parsed.outputPath;
          this.documentsService.updateJob(job.data.jobId, upd);
          this.logger.log(`Job ${job.data.jobId} completed, outputPath=${upd.outputPath}`);
        } catch (err) {
          this.logger.warn(`Could not update job on complete: ${err.message}`);
        }
      });
    });

    this.queue.on('global:failed', (jobId: string, err: string) => {
      this.queue.getJob(jobId).then((job) => {
        if (!job?.data?.jobId) return;
        this.logger.error(`Job ${jobId} [${job.name}] failed: ${err}`);
        try {
          this.documentsService.updateJob(job.data.jobId, {
            status: 'FAILED',
            error: typeof err === 'string' ? err : (err as any)?.message || 'Unknown error',
          });
        } catch (updateErr) {
          this.logger.warn(`Could not update job on fail: ${updateErr.message}`);
        }
      });
    });

    this.logger.log('Bull global queue event listeners registered');
  }
}
