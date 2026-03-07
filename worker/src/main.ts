import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { CommandService } from './services/command.service';
import { FileService } from './services/file.service';
import { CleanupService } from './services/cleanup.service';
import { createWorker } from './queue/worker.queue';

async function bootstrap() {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  const redisPassword = process.env.REDIS_PASSWORD || undefined;
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '4', 10);

  const uploadDir = path.resolve(process.env.UPLOAD_DIR || '../storage/uploads');
  const processingDir = path.resolve(process.env.PROCESSING_DIR || '../storage/processing');
  const outputDir = path.resolve(process.env.OUTPUT_DIR || '../storage/output');

  console.log('===========================================');
  console.log(' PDF Platform Worker');
  console.log('===========================================');
  console.log(`Redis: ${redisHost}:${redisPort}`);
  console.log(`Concurrency: ${concurrency}`);
  console.log(`Upload dir: ${uploadDir}`);
  console.log(`Output dir: ${outputDir}`);

  const commandService = new CommandService();
  const fileService = new FileService(uploadDir, processingDir, outputDir);

  // Check tool availability
  const tools = await commandService.checkAvailability();
  console.log('\nSystem tools:');
  for (const [tool, available] of Object.entries(tools)) {
    console.log(`  ${available ? '✅' : '❌'} ${tool}`);
  }

  // Start cleanup scheduler
  const cleanupService = new CleanupService([processingDir, outputDir], 60);
  cleanupService.startInterval();
  console.log('\n🧹 Cleanup scheduler started (every 60 min)');

  // Start worker
  const worker = createWorker(
    { host: redisHost, port: redisPort, password: redisPassword },
    commandService,
    fileService,
    concurrency,
  );

  console.log(`\n⚙️  Worker listening on queue "pdf-processing"...`);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await worker.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await worker.close();
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
