import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/students.schema';
import { Model } from 'mongoose';
import { CreateStudentsDto } from './dto/create-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async getAllStudents(): Promise<Student[]> {
    return await this.studentModel
      .find()
      .populate('userId', 'firstName lastName email')
      .exec();
  }

  async getOneStudentById(id: string): Promise<Student> {
    const student = await this.studentModel
      .findById(id)
      .populate('userId', 'firstName lastName email')
      .exec();
    if (!student) {
      throw new NotFoundException(`Öğrenci ${id} bulunamadı`);
    }
    return student;
  }

  async createStudent(createStudentsDto: CreateStudentsDto): Promise<Student> {
    // Öğrenci numarası zaten kullanılıyor mu kontrol et
    const existingStudent = await this.studentModel.findOne({
      studentNumber: createStudentsDto.studentNumber,
    });
    if (existingStudent) {
      throw new BadRequestException('Bu öğrenci numarası zaten kullanılıyor');
    }

    // UserId zaten bir öğrenciye atanmış mı kontrol et
    const existingUserStudent = await this.studentModel.findOne({
      userId: createStudentsDto.userId,
    });
    if (existingUserStudent) {
      throw new BadRequestException(
        'Bu kullanıcı zaten bir öğrenci olarak kayıtlı',
      );
    }

    const newStudent = new this.studentModel({
      ...createStudentsDto,
      enrollmentDate: new Date(createStudentsDto.enrollmentDate),
    });

    return await newStudent.save();
  }

  async updateStudent(
    id: string,
    updateStudentsDto: CreateStudentsDto,
  ): Promise<Student> {
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new NotFoundException(`Öğrenci ${id} bulunamadı`);
    }

    // Eğer öğrenci numarası değiştiriliyorsa, başka öğrenci tarafından kullanılıyor mu kontrol et
    if (
      updateStudentsDto.studentNumber &&
      updateStudentsDto.studentNumber !== student.studentNumber
    ) {
      const existingStudent = await this.studentModel.findOne({
        studentNumber: updateStudentsDto.studentNumber,
        _id: { $ne: id },
      });
      if (existingStudent) {
        throw new BadRequestException('Bu öğrenci numarası zaten kullanılıyor');
      }
    }

    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(
        id,
        {
          ...updateStudentsDto,
          enrollmentDate: updateStudentsDto.enrollmentDate
            ? new Date(updateStudentsDto.enrollmentDate)
            : student.enrollmentDate,
        },
        { new: true },
      )
      .populate('userId', 'firstName lastName email')
      .exec();

    return updatedStudent as Student;
  }

  async removeStudent(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new NotFoundException(`Öğrenci ${id} bulunamadı`);
    }

    return (await this.studentModel.findByIdAndDelete(id)) as Student;
  }
}
