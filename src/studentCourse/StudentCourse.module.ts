import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentCourse,
  StudentCourseSchema,
} from './schemas/student-courses.schema';
import { StudentCourseController } from './StudentCourse.controller';
import { StudentCourseService } from './StudentCourse.service';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentCourse.name, schema: StudentCourseSchema },
    ]),
  ],
  controllers: [StudentCourseController],
  providers: [StudentCourseService, RolesGuard],
  exports: [StudentCourseService],
})
export class StudentCourseModule {}
