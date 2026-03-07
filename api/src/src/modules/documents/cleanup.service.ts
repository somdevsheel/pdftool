import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  handleCleanup() {
    this.logger.log('Running scheduled file cleanup...');
    const result = this.documentsService.cleanExpiredFiles();
    this.logger.log(
      `Cleanup complete: ${result.deletedFiles} files, ${result.deletedJobs} jobs removed`,
    );
  }
}
