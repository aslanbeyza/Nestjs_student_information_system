import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { RolesGuard } from '../user/guards/roles.guard';
import { Roles } from '../user/dto/roles.decorator';
import { UserRole } from '../user/dto/user-role-enum';

@Controller('class')
@UseGuards(RolesGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  // POST /class - Sınıf oluşturma (Sadece Admin ve Teacher)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  // GET /class - Tüm sınıfları listeleme (Tüm roller)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAll() {
    return this.classService.findAll();
  }

  // GET /class/statistics - Sınıf istatistikleri (Admin ve Teacher)
  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStatistics() {
    return this.classService.getClassStatistics();
  }

  // GET /class/academic-year/:year - Akademik yıla göre sınıflar
  @Get('academic-year/:year')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByAcademicYear(@Param('year') year: string) {
    return this.classService.findByAcademicYear(year);
  }

  // GET /class/semester/:semester - Döneme göre sınıflar
  @Get('semester/:semester')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findBySemester(@Param('semester') semester: string) {
    return this.classService.findBySemester(semester);
  }

  // GET /class/location/:location - Lokasyona göre sınıflar
  @Get('location/:location')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByLocation(@Param('location') location: string) {
    return this.classService.findByLocation(location);
  }

  // GET /class/code/:classCode - Sınıf koduna göre arama
  @Get('code/:classCode')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByClassCode(@Param('classCode') classCode: string) {
    return this.classService.findByClassCode(classCode);
  }

  // GET /class/:id - Belirli bir sınıfı getirme (Tüm roller)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  // PATCH /class/:id - Sınıf güncelleme (Sadece Admin ve Teacher)
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateClassDto: Partial<CreateClassDto>,
  ) {
    return this.classService.update(id, updateClassDto);
  }

  // DELETE /class/:id - Sınıf silme (Sadece Admin)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }

  // GET /class/:id/courses - Sınıftaki dersleri ve öğretmen bilgilerini getir
  @Get(':id/courses')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getClassWithCourses(@Param('id') id: string) {
    return this.classService.getClassWithCourses(id);
  }

  // GET /class/:id/course-count - Sınıftaki ders sayısını getir
  @Get(':id/course-count')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getClassCourseCount(@Param('id') id: string) {
    return this.classService.getClassCourseCount(id);
  }
}
