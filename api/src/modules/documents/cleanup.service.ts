import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly documentsService: DocumentsService) {}

  // Every 10 minutes, so files are gone within ~70 minutes of upload — the site promises
  // "deleted after about 1 hour".
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCleanup() {
    this.logger.log('Running scheduled file cleanup...');
    const result = this.documentsService.cleanExpiredFiles();
    this.logger.log(`Cleanup complete: ${result.deletedFiles} expired files removed`);
  }
}
