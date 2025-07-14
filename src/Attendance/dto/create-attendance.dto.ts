import {
  IsMongoId,
  IsDateString,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsMongoId()
  studentId: string; // Students tablosuna referans

  @IsMongoId()
  courseId: string; // Courses tablosuna referans

  @IsDateString()
  attendanceDate: string; // Devam tarihi

  @IsString()
  @IsIn(['present', 'absent', 'late', 'excused'])
  status: string; // Devam durumu

  @IsOptional()
  @IsString()
  notes?: string; // Notlar (opsiyonel)
}
