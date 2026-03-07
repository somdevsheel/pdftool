import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import appConfig from './config/app.config';
import redisConfig from './config/redis.config';
import storageConfig from './config/storage.config';
import { QueueModule } from './queue/queue.module';
import { UploadModule } from './modules/upload/upload.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { HealthController } from './modules/health/health.controller';
import { CleanupService } from './modules/documents/cleanup.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, redisConfig, storageConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    ScheduleModule.forRoot(),
    QueueModule,
    DocumentsModule,
    UploadModule,
    JobsModule,
  ],
  controllers: [HealthController],
  providers: [CleanupService],
})
export class AppModule {}
