import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  studentNumber: string;

  @Prop({ required: true })
  classLevel: string;

  @Prop({ required: true })
  enrollmentDate: Date;

  @Prop({ default: 'active' })
  status: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
