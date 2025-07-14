import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentCourse,
  StudentCourseDocument,
} from './schemas/student-courses.schema';
import { Model } from 'mongoose';
import { CreateStudentCoursesDto } from './dto/create-student-courses.dto';

@Injectable()
export class StudentCourseService {
  constructor(
    @InjectModel(StudentCourse.name)
    private studentCourseModel: Model<StudentCourseDocument>,
  ) {}

  // Tüm kayıtları getir
  async getAllEnrollments(): Promise<StudentCourse[]> {
    return await this.studentCourseModel.find().exec();
  }

  // Belirli bir kayıt getir
  async getEnrollmentById(id: string): Promise<StudentCourse> {
    const enrollment = await this.studentCourseModel.findById(id).exec();
    if (!enrollment) {
      throw new NotFoundException(`Kayıt ${id} bulunamadı`);
    }
    return enrollment;
  }

  // Öğrenci-ders kaydı oluştur
  async createEnrollment(
    createStudentCoursesDto: CreateStudentCoursesDto,
  ): Promise<StudentCourse> {
    // Aynı öğrenci aynı derse zaten kayıtlı mı?
    const existingEnrollment = await this.studentCourseModel.findOne({
      studentId: createStudentCoursesDto.studentId,
      courseId: createStudentCoursesDto.courseId,
    });

    if (existingEnrollment) {
      throw new BadRequestException('Öğrenci zaten bu derse kayıtlı');
    }

    const newEnrollment = new this.studentCourseModel({
      ...createStudentCoursesDto,
      enrollmentDate: new Date(createStudentCoursesDto.enrollmentDate),
    });

    return await newEnrollment.save();
  }

  // Kayıt güncelle
  async updateEnrollment(
    id: string,
    updateStudentCoursesDto: CreateStudentCoursesDto,
  ): Promise<StudentCourse> {
    const enrollment = await this.studentCourseModel.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`Kayıt ${id} bulunamadı`);
    }

    const updatedEnrollment = await this.studentCourseModel
      .findByIdAndUpdate(
        id,
        {
          ...updateStudentCoursesDto,
          enrollmentDate: updateStudentCoursesDto.enrollmentDate
            ? new Date(updateStudentCoursesDto.enrollmentDate)
            : enrollment.enrollmentDate,
        },
        { new: true },
      )
      .exec();

    return updatedEnrollment as StudentCourse;
  }

  // Kayıt sil
  async removeEnrollment(id: string): Promise<StudentCourse> {
    const enrollment = await this.studentCourseModel.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`Kayıt ${id} bulunamadı`);
    }

    return (await this.studentCourseModel.findByIdAndDelete(
      id,
    )) as StudentCourse;
  }

  // Öğrencinin aldığı dersleri getir
  async getStudentCourses(studentId: string): Promise<StudentCourse[]> {
    return await this.studentCourseModel.find({ studentId }).exec();
  }

  // Derse kayıtlı öğrencileri getir
  async getCourseStudents(courseId: string): Promise<StudentCourse[]> {
    return await this.studentCourseModel.find({ courseId }).exec();
  }

  // Öğrencinin aktif derslerini getir
  async getActiveStudentCourses(studentId: string): Promise<StudentCourse[]> {
    return await this.studentCourseModel
      .find({ studentId, status: 'active' })
      .exec();
  }

  // Dersin aktif öğrencilerini getir
  async getActiveCourseStudents(courseId: string): Promise<StudentCourse[]> {
    return await this.studentCourseModel
      .find({ courseId, status: 'active' })
      .exec();
  }
}
