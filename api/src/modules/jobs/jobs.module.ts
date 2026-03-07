import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsQueue } from './jobs.queue';
import { DocumentsModule } from '../documents/documents.module';
import { QUEUE_NAMES } from '../../common/constants';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAMES.PDF_PROCESSING }),
    DocumentsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsQueue],
  exports: [JobsService],
})
export class JobsModule {}
