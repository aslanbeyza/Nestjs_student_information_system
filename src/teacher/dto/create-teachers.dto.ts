import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateTeachersDto {
  @IsString()
  userId: string; // Users tablosuna referans

  @IsString()
  department: string;

  @IsString()
  specialization: string;

  @IsString()
  hireDate: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsString()
  qualification?: string; // Eğitim durumu (Lisans, Yüksek Lisans, Doktora)

  @IsOptional()
  @IsNumber()
  experience?: number; // Deneyim yılı

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[]; // Verdiği dersler

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Aktif/Pasif durumu

  @IsOptional()
  @IsString()
  officeLocation?: string; // Ofis konumu
}
