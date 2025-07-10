// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.guard';

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


  // guarda global pero respeta @Public()
  app.useGlobalGuards(app.get(JwtAuthGuard));

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
