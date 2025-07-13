import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';

@Injectable() //yani bunu başka yere inject edebilirim
export class UsersService {
  //şimdi class içine giricem class içindeki fonksiyonlar metottur
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
  async getOneUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }
    return user;
  }
  async createUser(@Body() createUsersDto: CreateUsersDto): Promise<User> {
    const createdUser = new this.userModel(createUsersDto);
    return await createdUser.save();
  }

  async updateUser(id: string, updateUsersDto: CreateUsersDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUsersDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }
    return updatedUser;
  }
  async removeUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }

    return deletedUser;
  }
}
