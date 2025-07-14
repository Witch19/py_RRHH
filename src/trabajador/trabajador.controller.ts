import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { TrabajadorService } from './trabajador.service';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';

const storageCfg = diskStorage({
  destination: './uploads/cv',
  filename: (_req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${name}-${unique}${extname(file.originalname)}`);
  },
});

const pdfFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  file.mimetype === 'application/pdf'
    ? cb(null, true)
    : cb(new Error('Solo se permiten archivos PDF'), false);
};

@Controller('trabajador')
export class TrabajadorController {
  constructor(private readonly trabajadorService: TrabajadorService) {}

  /* ─────────────── CREAR ─────────────── */
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storageCfg, fileFilter: pdfFilter }))
  create(
    @Body() dto: CreateTrabajadorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const cvUrl = file ? `/uploads/cv/${file.filename}` : undefined;
    return this.trabajadorService.create({ ...dto, cvUrl });
  }

  /* ─────────────── LISTAR ─────────────── */
  @Get()
  findAll() {
    return this.trabajadorService.findAll();
  }

  /* ─────────────── DETALLE ─────────────── */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trabajadorService.findOne(id);
  }

  /* ─────────────── ACTUALIZAR ─────────────── */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: storageCfg, fileFilter: pdfFilter }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrabajadorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const extra = file ? { cvUrl: `/uploads/cv/${file.filename}` } : {};
    if ((dto as any).tipoTrabajoId)
      (dto as any).tipoTrabajoId = Number((dto as any).tipoTrabajoId);

    return this.trabajadorService.update(id, { ...dto, ...extra });
  }

  /* ─────────────── ELIMINAR ─────────────── */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trabajadorService.remove(id);
  }

  /* ─────────────── VER CV EN PDF ─────────────── */
  @Get('cv/:id')
  async getCv(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const trabajador = await this.trabajadorService.findOne(id);

    if (!trabajador || !trabajador.cvUrl) {
      return res.status(404).json({ message: 'CV no encontrado' });
    }

    const cvPath = path.join(__dirname, '..', '..', trabajador.cvUrl);
    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({ message: 'Archivo no existe en el servidor' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=cv.pdf');
    const fileStream = fs.createReadStream(cvPath);
    fileStream.pipe(res);
  }
}
