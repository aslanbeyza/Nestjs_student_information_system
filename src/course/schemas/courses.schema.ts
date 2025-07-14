import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class Course {
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId; // Teachers tablosuna referans

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId; // Class tablosuna referans

  @Prop({ required: true, unique: true })
  courseCode: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  credits: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  semester: string;

  @Prop({ required: true })
  academicYear: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Artık sadece teacher bilgileri otomatik yüklenir
// Students bilgileri ihtiyaç halinde manuel yüklenir
