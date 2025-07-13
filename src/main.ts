import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // ❌ Quita esta línea porque ya tienes guards globales configurados con APP_GUARD
  // app.useGlobalGuards(app.get(JwtAuthGuard));

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
