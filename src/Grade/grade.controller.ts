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
import { CreateGradeDto } from './dto/create-grade.dto';
import { GradeService } from './grade.service';
import { Grade } from './schemas/grade.schema';
import { UserRole } from '../user/dto/user-role-enum';
import { Roles } from '../user/dto/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  // Tüm notları getir
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getAllGrades(): Promise<Grade[]> {
    return this.gradeService.getAllGrades();
  }

  // Belirli bir not kaydı getir
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getGradeById(@Param('id') id: string): Promise<Grade> {
    return this.gradeService.getGradeById(id);
  }

  // Yeni not kaydı oluştur
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createGrade(@Body() createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeService.createGrade(createGradeDto);
  }

  // Not kaydı güncelle
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateGrade(
    @Param('id') id: string,
    @Body() updateGradeDto: CreateGradeDto,
  ): Promise<Grade> {
    return this.gradeService.updateGrade(id, updateGradeDto);
  }

  // Not kaydı sil
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeGrade(@Param('id') id: string): Promise<Grade> {
    return this.gradeService.removeGrade(id);
  }

  // Öğrencinin tüm notlarını getir
  @Get('student/:studentId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentGrades(@Param('studentId') studentId: string): Promise<Grade[]> {
    return this.gradeService.getStudentGrades(studentId);
  }

  // Dersin tüm notlarını getir
  @Get('course/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getCourseGrades(@Param('courseId') courseId: string): Promise<Grade[]> {
    return this.gradeService.getCourseGrades(courseId);
  }

  // Öğrencinin belirli dersteki notunu getir
  @Get('student/:studentId/course/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentCourseGrade(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<Grade> {
    return this.gradeService.getStudentCourseGrade(studentId, courseId);
  }
}
