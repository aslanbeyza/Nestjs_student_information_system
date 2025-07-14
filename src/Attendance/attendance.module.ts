import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, RolesGuard],
  exports: [AttendanceService],
})
export class AttendanceModule {}
