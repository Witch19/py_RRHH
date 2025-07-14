// src/scripts/sync-trabajador-id.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Trabajador } from '../trabajador/entities/trabajador.entity';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const trabajadorRepo = app.get(getRepositoryToken(Trabajador));

  const users = await userModel.find().exec();

  const logger = new Logger('SyncScript');

  for (const user of users) {
    const trabajador = await trabajadorRepo.findOne({ where: { email: user.email } });

    if (trabajador) {
      user.trabajadorId = trabajador.id;
      await user.save();
      logger.log(`✅ Actualizado ${user.email} → trabajadorId: ${trabajador.id}`);
    } else {
      logger.warn(`⚠️ No se encontró trabajador para ${user.email}`);
    }
  }

  await app.close();
  logger.log('🔁 Sincronización completada');
}

bootstrap();
