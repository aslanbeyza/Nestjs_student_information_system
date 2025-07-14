import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Teacher } from './schemas/teachers.schema';
import { TeachersService } from './teachers.service';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { UserRole } from '../user/dto/user-role-enum';
import { Roles } from '../user/dto/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';
import { Public } from '../auth/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Public() // Tüm öğretmenleri herkes görebilir
  @Get()
  // GET /teachers - Tüm öğretmenleri getir
  getAllTeachers(): Promise<Teacher[]> {
    return this.teachersService.getAllTeachers();
  }

  @Public() // Aktif öğretmenleri herkes görebilir
  @Get('active')
  // GET /teachers/active - Aktif öğretmenleri getir
  getActiveTeachers(): Promise<Teacher[]> {
    return this.teachersService.getActiveTeachers();
  }

  @Public() // Departmana göre filtreleme herkes yapabilir
  @Get('department')
  // GET /teachers/department?name=matematik - Departmana göre öğretmenleri getir
  getTeachersByDepartment(
    @Query('name') department: string,
  ): Promise<Teacher[]> {
    return this.teachersService.getTeachersByDepartment(department);
  }

  @Public() // Belirli öğretmeni herkes görebilir
  @Get(':id')
  // GET /teachers/:id - Belirli bir öğretmeni getir
  getTeacherById(@Param('id') id: string): Promise<Teacher> {
    return this.teachersService.getTeacherById(id);
  }

  @Public() // Yeni öğretmen oluşturma herkes yapabilir
  @Post()
  // POST /teachers - Yeni öğretmen oluştur
  createTeacher(@Body() createTeacherDto: CreateTeachersDto): Promise<Teacher> {
    return this.teachersService.createTeacher(createTeacherDto);
  }

  @Public() // Öğretmen güncelleme herkes yapabilir (teacher kendi bilgilerini güncelleyebilir)
  @Put(':id')
  // PUT /teachers/:id - Öğretmen bilgilerini güncelle
  updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: CreateTeachersDto,
  ): Promise<Teacher> {
    return this.teachersService.updateTeacher(id, updateTeacherDto);
  }

  // DELETE /teachers/:id - Öğretmeni sil (Sadece Admin)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteTeacher(@Param('id') id: string): Promise<Teacher> {
    return this.teachersService.deleteTeacher(id);
  }
}
