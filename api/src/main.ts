import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const port = process.env.PORT || 3001;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

  // Behind nginx: take the client IP from X-Forwarded-For (one proxy hop) so rate
  // limits apply per user rather than to nginx itself.
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.useBodyParser('json', { limit: '2mb' });

  // Global API prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS for web + mobile
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    exposedHeaders: ['Content-Disposition'],
    credentials: false,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableShutdownHooks();
  await app.listen(port);
  logger.log(`API running on http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
