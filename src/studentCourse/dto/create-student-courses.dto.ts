import { IsMongoId, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateStudentCoursesDto {
  @IsMongoId()
  studentId: string; // Students tablosuna referans

  @IsMongoId()
  courseId: string; // Courses tablosuna referans

  @IsDateString()
  enrollmentDate: string;

  @IsString()
  @IsOptional()
  status?: string; // Opsiyonel, default 'active'
} 