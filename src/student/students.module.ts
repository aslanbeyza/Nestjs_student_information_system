import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/students.schema';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, RolesGuard],
  exports: [StudentsService],
})
export class StudentsModule {}
