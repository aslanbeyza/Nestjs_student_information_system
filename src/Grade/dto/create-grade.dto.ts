import {
  IsMongoId,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateGradeDto {
  @IsMongoId()
  studentId: string; // Students tablosuna referans

  @IsMongoId()
  courseId: string; // Courses tablosuna referans

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  midtermGrade?: number; // Vize notu

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  finalGrade?: number; // Final notu

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  homeworkGrade?: number; // Ödev notu

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  projectGrade?: number; // Proje notu

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  finalScore?: number; // Genel ortalama

  @IsOptional()
  @IsString()
  @IsIn(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF'])
  letterGrade?: string; // Harf notu
}
