import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3001;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

  // Global API prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS for web + mobile
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

  await app.listen(port);
  logger.log(`🚀 API running on http://localhost:${port}/${apiPrefix}`);
  logger.log(`📋 Health: http://localhost:${port}/${apiPrefix}/health`);
}

bootstrap();
