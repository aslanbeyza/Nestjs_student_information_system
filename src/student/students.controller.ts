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
import { CreateStudentsDto } from './dto/create-students.dto';
import { StudentsService } from './students.service';
import { Student } from './schemas/students.schema';
import { UserRole } from '../user/dto/user-role-enum';
import { Roles } from '../user/dto/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all students',
    description: 'Retrieve all students from the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Students retrieved successfully',
    type: [Student]
  })
  getAllStudents(): Promise<Student[]> {
    return this.studentsService.getAllStudents();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getOneStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentsService.getOneStudentById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createStudent(
    @Body() createStudentsDto: CreateStudentsDto,
  ): Promise<Student> {
    return this.studentsService.createStudent(createStudentsDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentsDto: CreateStudentsDto,
  ): Promise<Student> {
    return this.studentsService.updateStudent(id, updateStudentsDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeStudent(@Param('id') id: string): Promise<Student> {
    return this.studentsService.removeStudent(id);
  }
}
