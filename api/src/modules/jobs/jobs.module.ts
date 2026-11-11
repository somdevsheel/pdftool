import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { DocumentsModule } from '../documents/documents.module';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [QueueModule, DocumentsModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
