import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentCourseDocument = HydratedDocument<StudentCourse>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class StudentCourse {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId; // Students tablosuna foreign key

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId; // Courses tablosuna foreign key

  @Prop({ required: true })
  enrollmentDate: Date;

  @Prop({ default: 'active' })
  status: string; // active, inactive, completed, dropped
}

export const StudentCourseSchema = SchemaFactory.createForClass(StudentCourse);

// Composite unique index - bir öğrenci aynı derse birden fazla kayıt olamaz
StudentCourseSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Populate işlemi için middleware
StudentCourseSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
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