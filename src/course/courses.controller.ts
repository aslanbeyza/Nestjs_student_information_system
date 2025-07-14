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
import { CreateCoursesDto } from './dto/create-courses.dto';
import { CoursesService } from './courses.service';
import { Course } from './schemas/courses.schema';
import { UserRole } from '../user/dto/user-role-enum';
import { Roles } from '../user/dto/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getOneCourseById(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getOneCourseById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createCourse(@Body() createCoursesDto: CreateCoursesDto): Promise<Course> {
    return this.coursesService.createCourse(createCoursesDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateCourse(
    @Param('id') id: string,
    @Body() updateCoursesDto: CreateCoursesDto,
  ): Promise<Course> {
    return this.coursesService.updateCourse(id, updateCoursesDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.removeCourse(id);
  }

  // GET /courses/class/:classId - Belirli bir sınıftaki dersleri getir
  @Get('class/:classId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getCoursesByClassId(@Param('classId') classId: string): Promise<Course[]> {
    return this.coursesService.getCoursesByClassId(classId);
  }

  // GET /courses/class-code/:classCode - Sınıf koduna göre dersleri getir
  @Get('class-code/:classCode')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getCoursesByClassCode(
    @Param('classCode') classCode: string,
  ): Promise<Course[]> {
    return this.coursesService.getCoursesByClassCode(classCode);
  }

  // GET /courses/statistics - Ders ve sınıf istatistikleri
  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getCourseClassStatistics() {
    return this.coursesService.getCourseClassStatistics();
  }
}
