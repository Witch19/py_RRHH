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

  @Prop({ default: 'user' }) // puede ser 'ADMIN', 'TRABAJADOR', etc.
  role: string;

  @Prop() // No lo hacemos obligatorio porque puede registrarse sin estar en trabajadores aún
  trabajadorId?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
