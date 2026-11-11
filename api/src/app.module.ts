import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
    // Per-IP request limit for every route; uploads and job creation set tighter ones.
    // Status polling (every ~1.5 s per job) stays well under this.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 240 }]),
    QueueModule,
    DocumentsModule,
    UploadModule,
    JobsModule,
  ],
  controllers: [HealthController],
  providers: [CleanupService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
