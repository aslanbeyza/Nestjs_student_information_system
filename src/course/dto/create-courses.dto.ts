import { IsString, IsNumber, IsMongoId } from 'class-validator';

export class CreateCoursesDto {
  @IsMongoId()
  teacherId: string; // Teachers tablosuna referans

  @IsMongoId()
  classId: string; // Class tablosuna referans

  @IsString()
  courseCode: string;

  @IsString()
  courseName: string;

  @IsNumber()
  credits: number;

  @IsString()
  description: string;

  @IsString()
  semester: string;

  @IsString()
  academicYear: string;
}
