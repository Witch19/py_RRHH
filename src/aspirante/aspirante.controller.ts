// src/aspirante/aspirante.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AspiranteService } from './aspirante.service';
import { Public } from '../public.decorator';
import { CreateAspiranteDto } from './dto/create-aspirante.dto';

@Controller('aspirante')
export class AspiranteController {
  constructor(private readonly aspiranteService: AspiranteService) {}

  @Post()
  @Public()
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './public/uploads/cv/',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${file.originalname}`;
          cb(null, name);
        },
      }),
    }),
  )
  create(
    @Body() body: CreateAspiranteDto, // ✅ con DTO
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.aspiranteService.create(body, file?.filename);
  }

  @Get()
  findAll() {
    return this.aspiranteService.findAll();
  }
}
