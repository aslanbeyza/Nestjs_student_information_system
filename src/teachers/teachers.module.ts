import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schemas/teachers.schema';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { RolesGuard } from '../users/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService, RolesGuard],
  exports: [TeachersService], // Diğer modüller için export
})
export class TeachersModule {}
