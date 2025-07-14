import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  classCode: string;

  @IsString()
  @IsNotEmpty()
  className: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
