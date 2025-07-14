import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true, unique: true })
  classCode: string;

  @Prop({ required: true })
  className: string;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ required: true })
  semester: string;

  @Prop({ required: true })
  academicYear: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// Create unique index for classCode
ClassSchema.index({ classCode: 1 }, { unique: true });
