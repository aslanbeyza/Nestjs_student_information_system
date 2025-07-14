import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    try {
      const createdClass = new this.classModel(createClassDto);
      return await createdClass.save();
    } catch (error: any) {
      if ((error as { code?: number })?.code === 11000) {
        throw new ConflictException('Bu sınıf kodu zaten mevcut');
      }
      throw error;
    }
  }

  async findAll(): Promise<Class[]> {
    return await this.classModel.find().exec();
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classModel.findById(id).exec();
    if (!classEntity) {
      throw new NotFoundException('Sınıf bulunamadı');
    }
    return classEntity;
  }

  async findByClassCode(classCode: string): Promise<Class> {
    const classEntity = await this.classModel.findOne({ classCode }).exec();
    if (!classEntity) {
      throw new NotFoundException('Sınıf bulunamadı');
    }
    return classEntity;
  }

  async update(
    id: string,
    updateClassDto: Partial<CreateClassDto>,
  ): Promise<Class> {
    try {
      const updatedClass = await this.classModel
        .findByIdAndUpdate(
          id,
          { ...updateClassDto, updatedAt: new Date() },
          { new: true },
        )
        .exec();

      if (!updatedClass) {
        throw new NotFoundException('Sınıf bulunamadı');
      }
      return updatedClass;
    } catch (error: any) {
      if ((error as { code?: number })?.code === 11000) {
        throw new ConflictException('Bu sınıf kodu zaten mevcut');
      }
      throw error;
    }
  }
  async remove(id: string): Promise<void> {
    const result = await this.classModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Sınıf bulunamadı');
    }
  }

  async findByAcademicYear(academicYear: string): Promise<Class[]> {
    return await this.classModel.find({ academicYear }).exec();
  }

  async findBySemester(semester: string): Promise<Class[]> {
    return await this.classModel.find({ semester }).exec();
  }

  async findByLocation(location: string): Promise<Class[]> {
    return await this.classModel.find({ location }).exec();
  }

  async getClassStatistics() {
    const totalClasses = await this.classModel.countDocuments();

    const [capacityResult] = await this.classModel.aggregate<{
      totalCapacity: number;
    }>([{ $group: { _id: null, totalCapacity: { $sum: '$capacity' } } }]);

    const classesBySemester = await this.classModel.aggregate<{
      _id: string;
      count: number;
    }>([{ $group: { _id: '$semester', count: { $sum: 1 } } }]);

    const classesByAcademicYear = await this.classModel.aggregate<{
      _id: string;
      count: number;
    }>([{ $group: { _id: '$academicYear', count: { $sum: 1 } } }]);

    return {
      totalClasses,
      totalCapacity: capacityResult?.totalCapacity || 0,
      classesBySemester,
      classesByAcademicYear,
    };
  }

  // Sınıfın ders sayısını getir
  async getClassCourseCount(classId: string): Promise<number> {
    // Course modeli import etmek yerine aggregate kullanıyoruz
    const result = await this.classModel.aggregate<{ courseCount: number }>([
      { $match: { _id: classId } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'classId',
          as: 'courses',
        },
      },
      {
        $project: {
          courseCount: { $size: '$courses' },
        },
      },
    ]);

    return result[0]?.courseCount || 0;
  }

  // Detaylı sınıf bilgisi (dersler dahil)
  async getClassWithCourses(classId: string) {
    const classInfo = await this.findOne(classId);

    const coursesData = await this.classModel.aggregate<{
      courses: Array<{
        courseCode: string;
        courseName: string;
        credits: number;
        description: string;
        teacher: {
          department: string;
          specialization: string;
          user: {
            firstName: string;
            lastName: string;
            email: string;
          };
        };
      }>;
    }>([
      { $match: { _id: new Types.ObjectId(classId) } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'classId',
          as: 'courses',
          pipeline: [
            {
              $lookup: {
                from: 'teachers',
                localField: 'teacherId',
                foreignField: '_id',
                as: 'teacher',
              },
            },
            { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'users',
                localField: 'teacher.userId',
                foreignField: '_id',
                as: 'teacher.user',
              },
            },
            {
              $unwind: {
                path: '$teacher.user',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
    ]);

    return {
      classCode: classInfo.classCode,
      className: classInfo.className,
      capacity: classInfo.capacity,
      semester: classInfo.semester,
      academicYear: classInfo.academicYear,
      location: classInfo.location,
      courses: coursesData[0]?.courses || [],
    };
  }
}
