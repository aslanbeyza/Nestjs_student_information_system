import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { Model } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  // Tüm devam kayıtlarını getir
  async getAllAttendances(): Promise<Attendance[]> {
    return await this.attendanceModel.find().exec();
  }

  // Belirli bir devam kaydı getir
  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) {
      throw new NotFoundException(`Devam kaydı ${id} bulunamadı`);
    }
    return attendance;
  }

  // Devam kaydı oluştur
  async createAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    // Aynı öğrenci aynı ders aynı gün için zaten kayıt var mı?
    const existingAttendance = await this.attendanceModel.findOne({
      studentId: createAttendanceDto.studentId,
      courseId: createAttendanceDto.courseId,
      attendanceDate: new Date(createAttendanceDto.attendanceDate),
    });

    if (existingAttendance) {
      throw new BadRequestException(
        'Bu öğrenci için bu derste bu tarihte zaten devam kaydı mevcut',
      );
    }

    const newAttendance = new this.attendanceModel({
      ...createAttendanceDto,
      attendanceDate: new Date(createAttendanceDto.attendanceDate),
    });

    return await newAttendance.save();
  }

  // Devam kaydı güncelle
  async updateAttendance(
    id: string,
    updateAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id);
    if (!attendance) {
      throw new NotFoundException(`Devam kaydı ${id} bulunamadı`);
    }

    const updatedAttendance = await this.attendanceModel
      .findByIdAndUpdate(
        id,
        {
          ...updateAttendanceDto,
          attendanceDate: updateAttendanceDto.attendanceDate
            ? new Date(updateAttendanceDto.attendanceDate)
            : attendance.attendanceDate,
        },
        { new: true },
      )
      .exec();

    return updatedAttendance as Attendance;
  }

  // Devam kaydı sil
  async removeAttendance(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id);
    if (!attendance) {
      throw new NotFoundException(`Devam kaydı ${id} bulunamadı`);
    }

    return (await this.attendanceModel.findByIdAndDelete(id)) as Attendance;
  }

  // Öğrencinin tüm devam kayıtlarını getir
  async getStudentAttendances(studentId: string): Promise<Attendance[]> {
    return await this.attendanceModel.find({ studentId }).exec();
  }

  // Dersin tüm devam kayıtlarını getir
  async getCourseAttendances(courseId: string): Promise<Attendance[]> {
    return await this.attendanceModel.find({ courseId }).exec();
  }

  // Öğrencinin belirli dersteki devam kayıtlarını getir
  async getStudentCourseAttendances(
    studentId: string,
    courseId: string,
  ): Promise<Attendance[]> {
    return await this.attendanceModel.find({ studentId, courseId }).exec();
  }

  // Öğrencinin belirli dersteki devam istatistikleri
  async getStudentAttendanceStats(
    studentId: string,
    courseId: string,
  ): Promise<any> {
    const attendances = await this.attendanceModel
      .find({ studentId, courseId })
      .exec();

    const total = attendances.length;
    const present = attendances.filter((a) => a.status === 'present').length;
    const absent = attendances.filter((a) => a.status === 'absent').length;
    const late = attendances.filter((a) => a.status === 'late').length;
    const excused = attendances.filter((a) => a.status === 'excused').length;

    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: `${attendanceRate}%`,
    };
  }

  // Dersin genel devam istatistikleri
  async getCourseAttendanceStats(courseId: string): Promise<any> {
    const attendances = await this.attendanceModel.find({ courseId }).exec();

    const total = attendances.length;
    const present = attendances.filter((a) => a.status === 'present').length;
    const absent = attendances.filter((a) => a.status === 'absent').length;
    const late = attendances.filter((a) => a.status === 'late').length;
    const excused = attendances.filter((a) => a.status === 'excused').length;

    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: `${attendanceRate}%`,
    };
  }

  // Belirli tarih aralığındaki devam kayıtları
  async getAttendancesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Attendance[]> {
    return await this.attendanceModel
      .find({
        attendanceDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .exec();
  }
}
