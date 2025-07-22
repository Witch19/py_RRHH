// src/aspirante/aspirante.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // ✅ importante
import { AspiranteService } from './aspirante.service';
import { Public } from '../public.decorator';
import { CreateAspiranteDto } from './dto/create-aspirante.dto';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('aspirante')
export class AspiranteController {
  constructor(private readonly aspiranteService: AspiranteService) {}

  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: memoryStorage(), // ✅ usamos almacenamiento en memoria
      limits: { fileSize: 10 * 1024 * 1024 }, // ✅ opcional: límite 10MB
    }),
  )
  async create(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.aspiranteService.create(body, file);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.aspiranteService.findAll();
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aspiranteService.remove(id);
  }
}
