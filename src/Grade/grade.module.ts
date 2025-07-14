import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Grade, GradeSchema } from './schemas/grade.schema';
import { GradeService } from './grade.service';
import { RolesGuard } from '../user/guards/roles.guard';
import { GradeController } from './grade.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Grade.name, schema: GradeSchema }]),
  ],
  controllers: [GradeController],
  providers: [GradeService, RolesGuard],
  exports: [GradeService],
})
export class GradeModule {}
