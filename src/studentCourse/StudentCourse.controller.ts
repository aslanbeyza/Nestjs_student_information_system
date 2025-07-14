import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentCoursesDto } from './dto/create-student-courses.dto';
import { StudentCourseService } from './StudentCourse.service';
import { StudentCourse } from './schemas/student-courses.schema';
import { UserRole } from '../user/dto/user-role-enum';
import { Roles } from '../user/dto/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';

@Controller('student-courses')
export class StudentCourseController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  // Tüm kayıtları getir
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getAllEnrollments(): Promise<StudentCourse[]> {
    return this.studentCourseService.getAllEnrollments();
  }

  // Belirli bir kayıt getir
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getEnrollmentById(@Param('id') id: string): Promise<StudentCourse> {
    return this.studentCourseService.getEnrollmentById(id);
  }

  // Yeni kayıt oluştur
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createEnrollment(
    @Body() createStudentCoursesDto: CreateStudentCoursesDto,
  ): Promise<StudentCourse> {
    return this.studentCourseService.createEnrollment(createStudentCoursesDto);
  }

  // Kayıt güncelle
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateEnrollment(
    @Param('id') id: string,
    @Body() updateStudentCoursesDto: CreateStudentCoursesDto,
  ): Promise<StudentCourse> {
    return this.studentCourseService.updateEnrollment(
      id,
      updateStudentCoursesDto,
    );
  }

  // Kayıt sil
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeEnrollment(@Param('id') id: string): Promise<StudentCourse> {
    return this.studentCourseService.removeEnrollment(id);
  }

  // Öğrencinin aldığı dersleri getir
  @Get('student/:studentId/courses')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentCourses(
    @Param('studentId') studentId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCourseService.getStudentCourses(studentId);
  }

  // Derse kayıtlı öğrencileri getir
  @Get('course/:courseId/students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getCourseStudents(
    @Param('courseId') courseId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCourseService.getCourseStudents(courseId);
  }

  // Öğrencinin aktif derslerini getir
  @Get('student/:studentId/active-courses')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getActiveStudentCourses(
    @Param('studentId') studentId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCourseService.getActiveStudentCourses(studentId);
  }

  // Dersin aktif öğrencilerini getir
  @Get('course/:courseId/active-students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getActiveCourseStudents(
    @Param('courseId') courseId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCourseService.getActiveCourseStudents(courseId);
  }
}
