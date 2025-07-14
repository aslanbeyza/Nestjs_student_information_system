import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Grade, GradeDocument } from './schemas/grade.schema';
import { Model } from 'mongoose';
import { CreateGradeDto } from './dto/create-grade.dto';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
  ) {}

  // Tüm notları getir
  async getAllGrades(): Promise<Grade[]> {
    return await this.gradeModel.find().exec();
  }

  // Belirli bir not kaydı getir
  async getGradeById(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findById(id).exec();
    if (!grade) {
      throw new NotFoundException(`Not kaydı ${id} bulunamadı`);
    }
    return grade;
  }

  // Not kaydı oluştur
  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    // Aynı öğrenci aynı ders için zaten not kaydı var mı?
    const existingGrade = await this.gradeModel.findOne({
      studentId: createGradeDto.studentId,
      courseId: createGradeDto.courseId,
    });

    if (existingGrade) {
      throw new BadRequestException(
        'Bu öğrenci için bu derste zaten not kaydı mevcut',
      );
    }

    // Final score hesaplama (eğer belirtilmemişse otomatik hesapla)
    let finalScore = createGradeDto.finalScore;
    if (!finalScore && this.hasRequiredGrades(createGradeDto)) {
      finalScore = this.calculateFinalScore(createGradeDto);
    }

    // Letter grade hesaplama (eğer belirtilmemişse otomatik hesapla)
    let letterGrade = createGradeDto.letterGrade;
    if (!letterGrade && finalScore) {
      letterGrade = this.calculateLetterGrade(finalScore);
    }

    const newGrade = new this.gradeModel({
      ...createGradeDto,
      finalScore,
      letterGrade,
    });

    return await newGrade.save();
  }

  // Not kaydı güncelle
  async updateGrade(
    id: string,
    updateGradeDto: CreateGradeDto,
  ): Promise<Grade> {
    const grade = await this.gradeModel.findById(id);
    if (!grade) {
      throw new NotFoundException(`Not kaydı ${id} bulunamadı`);
    }

    // Final score yeniden hesaplama
    let finalScore = updateGradeDto.finalScore;
    if (!finalScore && this.hasRequiredGrades(updateGradeDto)) {
      finalScore = this.calculateFinalScore(updateGradeDto);
    }

    // Letter grade yeniden hesaplama
    let letterGrade = updateGradeDto.letterGrade;
    if (!letterGrade && finalScore) {
      letterGrade = this.calculateLetterGrade(finalScore);
    }

    const updatedGrade = await this.gradeModel
      .findByIdAndUpdate(
        id,
        {
          ...updateGradeDto,
          finalScore,
          letterGrade,
        },
        { new: true },
      )
      .exec();

    return updatedGrade as Grade;
  }

  // Not kaydı sil
  async removeGrade(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findById(id);
    if (!grade) {
      throw new NotFoundException(`Not kaydı ${id} bulunamadı`);
    }

    return (await this.gradeModel.findByIdAndDelete(id)) as Grade;
  }

  // Öğrencinin tüm notlarını getir
  async getStudentGrades(studentId: string): Promise<Grade[]> {
    return await this.gradeModel.find({ studentId }).exec();
  }

  // Dersin tüm notlarını getir
  async getCourseGrades(courseId: string): Promise<Grade[]> {
    return await this.gradeModel.find({ courseId }).exec();
  }

  // Öğrencinin belirli dersteki notunu getir
  async getStudentCourseGrade(
    studentId: string,
    courseId: string,
  ): Promise<Grade> {
    const grade = await this.gradeModel.findOne({ studentId, courseId }).exec();

    if (!grade) {
      throw new NotFoundException(
        'Bu öğrenci için bu derste not kaydı bulunamadı',
      );
    }

    return grade;
  }

  // Final score hesaplama (örnek: %30 vize + %40 final + %20 ödev + %10 proje)
  private calculateFinalScore(gradeDto: CreateGradeDto): number {
    const midterm = gradeDto.midtermGrade || 0;
    const final = gradeDto.finalGrade || 0;
    const homework = gradeDto.homeworkGrade || 0;
    const project = gradeDto.projectGrade || 0;

    return Math.round(
      midterm * 0.3 + final * 0.4 + homework * 0.2 + project * 0.1,
    );
  }

  // Harf notu hesaplama
  private calculateLetterGrade(finalScore: number): string {
    if (finalScore >= 90) return 'AA';
    if (finalScore >= 85) return 'BA';
    if (finalScore >= 80) return 'BB';
    if (finalScore >= 75) return 'CB';
    if (finalScore >= 70) return 'CC';
    if (finalScore >= 65) return 'DC';
    if (finalScore >= 60) return 'DD';
    if (finalScore >= 50) return 'FD';
    return 'FF';
  }

  // Gerekli notlar girilmiş mi kontrol et
  private hasRequiredGrades(gradeDto: CreateGradeDto): boolean {
    return !!(gradeDto.midtermGrade && gradeDto.finalGrade);
  }
}
