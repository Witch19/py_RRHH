// src/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'TRABAJADOR' })
  role: string;

  @Prop()
  telefono?: string;

  @Prop() // es un ID que referencia a PostgreSQL
  tipoTrabajoId?: number;

  @Prop() // Es el ID del trabajador (desde PostgreSQL)
  trabajadorId?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
