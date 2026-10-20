import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

// Polyfill BigInt serialization to prevent JSON.stringify errors
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix 'api' agar sesuai dengan frontend (http://localhost:8000/api)
  app.setGlobalPrefix('api');

  // Aktifkan CORS untuk frontend (Vite React di port 5173)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe untuk DTO class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  const port = process.env.PORT || 8000;
  await app.listen(port);

  logger.log(`🚀 Digo Chatbot API (NestJS) berjalan di http://localhost:${port}/api`);
}

bootstrap();
