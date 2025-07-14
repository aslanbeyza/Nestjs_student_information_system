import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Users tablosuna referans

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  hireDate: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 0 })
  salary: number;

  @Prop({ default: '' })
  qualification: string; // Eğitim durumu

  @Prop({ default: 0 })
  experience: number; // Deneyim yılı

  @Prop({ type: [String], default: [] })
  subjects: string[]; // Verdiği dersler

  @Prop({ default: true })
  isActive: boolean; // Aktif/Pasif durumu

  @Prop({ default: '' })
  officeLocation: string; // Ofis konumu
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

// Populate işlemi için middleware
TeacherSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email phone role',
  });
});

//Users (1) ←→ (1) Teachers
