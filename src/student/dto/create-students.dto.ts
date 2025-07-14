import { IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateStudentsDto {
  @IsMongoId()
  userId: string;

  @IsString()
  studentNumber: string;

  @IsString()
  classLevel: string;

  @IsDateString()
  enrollmentDate: string;

  @IsString()
  status: string;
}
