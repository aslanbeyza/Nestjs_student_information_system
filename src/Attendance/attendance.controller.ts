import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceService } from './attendance.service';
import { Attendance } from './schemas/attendance.schema';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/user/dto/user-role-enum';
import { Roles } from 'src/user/dto/roles.decorator';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Tüm devam kayıtlarını getir
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getAllAttendances(): Promise<Attendance[]> {
    return this.attendanceService.getAllAttendances();
  }

  // Belirli bir devam kaydı getir
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getAttendanceById(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.getAttendanceById(id);
  }

  // Yeni devam kaydı oluştur
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  // Devam kaydı güncelle
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  // Devam kaydı sil
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeAttendance(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.removeAttendance(id);
  }

  // Öğrencinin tüm devam kayıtlarını getir
  @Get('student/:studentId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentAttendances(
    @Param('studentId') studentId: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.getStudentAttendances(studentId);
  }

  // Dersin tüm devam kayıtlarını getir
  @Get('course/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getCourseAttendances(
    @Param('courseId') courseId: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.getCourseAttendances(courseId);
  }

  // Öğrencinin belirli dersteki devam kayıtlarını getir
  @Get('student/:studentId/course/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentCourseAttendances(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.getStudentCourseAttendances(
      studentId,
      courseId,
    );
  }

  // Öğrencinin belirli dersteki devam istatistikleri
  @Get('student/:studentId/course/:courseId/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentAttendanceStats(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<any> {
    return this.attendanceService.getStudentAttendanceStats(
      studentId,
      courseId,
    );
  }

  // Dersin genel devam istatistikleri
  @Get('course/:courseId/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getCourseAttendanceStats(@Param('courseId') courseId: string): Promise<any> {
    return this.attendanceService.getCourseAttendanceStats(courseId);
  }

  // Belirli tarih aralığındaki devam kayıtları
  @Get('date-range')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getAttendancesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.getAttendancesByDateRange(startDate, endDate);
  }
}
