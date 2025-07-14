import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId; // Students tablosuna foreign key

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId; // Courses tablosuna foreign key

  @Prop({ required: true })
  attendanceDate: Date; // Devam tarihi

  @Prop({
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present',
  })
  status: string; // Devam durumu

  @Prop({ type: String, default: '' })
  notes: string; // Notlar (opsiyonel)
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Composite unique index - bir öğrenci bir derste aynı gün sadece bir devam kaydı olabilir
AttendanceSchema.index(
  { studentId: 1, courseId: 1, attendanceDate: 1 },
  { unique: true },
);

// Populate işlemi için middleware
AttendanceSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
  this.populate([
    {
      path: 'studentId',
      select: 'studentNumber classLevel userId',
      populate: {
        path: 'userId',
        select: 'firstName lastName email',
      },
    },
    {
      path: 'courseId',
      select: 'courseCode courseName credits teacherId',
      populate: {
        path: 'teacherId',
        select: 'department title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName',
        },
      },
    },
  ]);
}); 