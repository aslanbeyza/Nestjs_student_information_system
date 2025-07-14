import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from './schemas/teachers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherDocument } from './schemas/teachers.schema';
import { CreateTeachersDto } from './dto/create-teachers.dto';

@Injectable() //yani bunu başka yere inject edebilirim
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  // Tüm öğretmenleri getir
  async getAllTeachers(): Promise<Teacher[]> {
    return await this.teacherModel.find();
  }

  // ID'ye göre öğretmen getir
  async getTeacherById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id);
    if (!teacher) {
      throw new NotFoundException(`Öğretmen ${id} bulunamadı`);
    }
    return teacher;
  }

  // userId'ye göre öğretmen getir
  async getTeacherByUserId(userId: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findOne({ userId });
    if (!teacher) {
      throw new NotFoundException(`UserId ${userId} için öğretmen bulunamadı`);
    }
    return teacher;
  }

  // Yeni öğretmen oluştur
  async createTeacher(createTeacherDto: CreateTeachersDto): Promise<Teacher> {
    const createdTeacher = new this.teacherModel(createTeacherDto);
    return await createdTeacher.save();
  }

  // Öğretmen güncelle
  async updateTeacher(
    id: string,
    updateTeacherDto: CreateTeachersDto,
  ): Promise<Teacher> {
    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(
      id,
      updateTeacherDto,
      { new: true },
    );
    if (!updatedTeacher) {
      throw new NotFoundException(`Öğretmen ${id} bulunamadı`);
    }
    return updatedTeacher;
  }

  // Öğretmen sil
  async deleteTeacher(id: string): Promise<Teacher> {
    const deletedTeacher = await this.teacherModel.findByIdAndDelete(id);
    if (!deletedTeacher) {
      throw new NotFoundException(`Öğretmen ${id} bulunamadı`);
    }
    return deletedTeacher;
  }

  // Belirli bir departmandaki öğretmenleri getir
  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    return await this.teacherModel.find({ department });
  }

  // Aktif öğretmenleri getir
  async getActiveTeachers(): Promise<Teacher[]> {
    return await this.teacherModel.find({ isActive: true });
  }
}
