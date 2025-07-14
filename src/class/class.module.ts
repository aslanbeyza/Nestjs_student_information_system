import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './schemas/class.schema';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  controllers: [ClassController],
  providers: [ClassService, RolesGuard],
  exports: [ClassService], // Diğer modüller için export
})
export class ClassModule {}
