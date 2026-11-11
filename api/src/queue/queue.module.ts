import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NAMES } from '../common/constants';

// BullMQ, the same library the worker uses. (The API used to run on the older `bull`
// package, whose events never reached the BullMQ worker.)
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          // Keep finished jobs for as long as their output files live (FILE_EXPIRY_MINUTES,
          // default 60) so users can still poll and download. A count-based limit could
          // drop a job before its user came back for it on a busy day.
          removeOnComplete: { age: 2 * 60 * 60 },
          removeOnFail: { age: 24 * 60 * 60 },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: QUEUE_NAMES.PDF_PROCESSING }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
