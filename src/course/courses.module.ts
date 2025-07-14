import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/courses.schema';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, RolesGuard],
  exports: [CoursesService],
})
export class CoursesModule {}
