import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/courses.schema';
import { Model } from 'mongoose';
import { CreateCoursesDto } from './dto/create-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async getAllCourses(): Promise<Course[]> {
    return await this.courseModel
      .find()
      .populate({
        path: 'teacherId',
        select: 'department specialization title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email',
        },
      })
      .populate({
        path: 'classId',
        select: 'classCode className capacity location',
      })
      .exec();
  }

  async getOneCourseById(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate({
        path: 'teacherId',
        select: 'department specialization title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email',
        },
      })
      .populate({
        path: 'classId',
        select: 'classCode className capacity location',
      })
      .exec();
    if (!course) {
      throw new NotFoundException(`Ders ${id} bulunamadı`);
    }
    return course;
  }

  async createCourse(createCoursesDto: CreateCoursesDto): Promise<Course> {
    // Ders kodu zaten kullanılıyor mu kontrol et
    const existingCourse = await this.courseModel.findOne({
      courseCode: createCoursesDto.courseCode,
    });
    if (existingCourse) {
      throw new BadRequestException('Bu ders kodu zaten kullanılıyor');
    }

    const newCourse = new this.courseModel(createCoursesDto);
    return await newCourse.save();
  }

  async updateCourse(
    id: string,
    updateCoursesDto: CreateCoursesDto,
  ): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Ders ${id} bulunamadı`);
    }

    // Eğer ders kodu değiştiriliyorsa, başka ders tarafından kullanılıyor mu kontrol et
    if (
      updateCoursesDto.courseCode &&
      updateCoursesDto.courseCode !== course.courseCode
    ) {
      const existingCourse = await this.courseModel.findOne({
        courseCode: updateCoursesDto.courseCode,
        _id: { $ne: id },
      });
      if (existingCourse) {
        throw new BadRequestException('Bu ders kodu zaten kullanılıyor');
      }
    }

    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCoursesDto, { new: true })
      .populate({
        path: 'teacherId',
        select: 'department specialization title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email',
        },
      })
      .populate({
        path: 'classId',
        select: 'classCode className capacity location',
      })
      .exec();

    return updatedCourse as Course;
  }

  async removeCourse(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Ders ${id} bulunamadı`);
    }

    return (await this.courseModel.findByIdAndDelete(id)) as Course;
  }

  // Belirli bir sınıftaki dersleri getir
  async getCoursesByClassId(classId: string): Promise<Course[]> {
    return await this.courseModel
      .find({ classId })
      .populate({
        path: 'teacherId',
        select: 'department specialization title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email',
        },
      })
      .populate({
        path: 'classId',
        select: 'classCode className capacity location',
      })
      .exec();
  }

  // Sınıf koduna göre dersleri getir
  async getCoursesByClassCode(classCode: string): Promise<Course[]> {
    return await this.courseModel
      .find()
      .populate({
        path: 'teacherId',
        select: 'department specialization title userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email',
        },
      })
      .populate({
        path: 'classId',
        select: 'classCode className capacity location',
        match: { classCode: classCode },
      })
      .exec()
      .then((courses) => courses.filter((course) => course.classId)); // classId null olanları filtrele
  }

  // Ders ve sınıf istatistikleri
  async getCourseClassStatistics() {
    const totalCourses = await this.courseModel.countDocuments();

    const coursesByClass = await this.courseModel.aggregate<{
      _id: string;
      count: number;
      className: string;
      classCode: string;
    }>([
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class',
        },
      },
      { $unwind: '$class' },
      {
        $group: {
          _id: '$classId',
          count: { $sum: 1 },
          className: { $first: '$class.className' },
          classCode: { $first: '$class.classCode' },
        },
      },
    ]);

    const coursesByTeacher = await this.courseModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: '$teacherId',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalCourses,
      coursesByClass,
      coursesByTeacher,
    };
  }
}
