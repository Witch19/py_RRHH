import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.enableCors();
/*
  const allowedOrigins = [
    'http://localhost:5173',
    'https://py-rrhh-frontend-h5qzhpeg6c-saavedras-projects-6ac50bef.vercel.app',
    'https://py-rrhh-frontend-o7ly4npyf-saavedras-projects-6ac50bef.vercel.app',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Manejo manual de OPTIONS (preflight)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.options('*', (_req, res) => {
    res.sendStatus(204);
  });
*/
  await app.listen(3105);
}
bootstrap();
