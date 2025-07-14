import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GradeDocument = HydratedDocument<Grade>;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class Grade {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId; // Students tablosuna foreign key

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId; // Courses tablosuna foreign key

  @Prop({ type: Number, min: 0, max: 100, default: null })
  midtermGrade: number; // Vize notu

  @Prop({ type: Number, min: 0, max: 100, default: null })
  finalGrade: number; // Final notu

  @Prop({ type: Number, min: 0, max: 100, default: null })
  homeworkGrade: number; // Ödev notu

  @Prop({ type: Number, min: 0, max: 100, default: null })
  projectGrade: number; // Proje notu

  @Prop({ type: Number, min: 0, max: 100, default: null })
  finalScore: number; // Genel ortalama

  @Prop({
    type: String,
    enum: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF'],
    default: null,
  })
  letterGrade: string; // Harf notu
}

export const GradeSchema = SchemaFactory.createForClass(Grade);

// Composite unique index - bir öğrenci bir dersten birden fazla not alamaz
GradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Populate işlemi için middleware
GradeSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
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
