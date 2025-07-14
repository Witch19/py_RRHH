/* src/curso/dto/create-curso.dto.ts */
export class CreateCursoDto {
  nombre: string;
  descripcion?: string;
  duracion?: string;
  areas?: string[];
}