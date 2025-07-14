import {
  Injectable,
  Body,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { UserRole } from './dto/user-role-enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

  //bu kısımda role bazlı kullanıcıları getirmek için kullanıyoruz
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userModel.find({ role });
  }

  //bu kısımda kullanıcı oluşturmak için kullanıyoruz
  async createUser(
    @Body() createUsersDto: CreateUsersDto,
  ): Promise<{ user: UserDocument; emailVerificationToken: string }> {
    // Email zaten kullanılıyor mu kontrol et
    const existingUser = await this.findByEmail(createUsersDto.email);
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanılıyor');
    }

    // Eğer sistemde hiç kullanıcı yoksa, ilk kullanıcıyı admin olarak oluştur
    const userCount = await this.userModel.countDocuments();
    if (userCount === 0) {
      createUsersDto.role = UserRole.ADMIN;
    }

    // Şifreyi hash'le
    const hashedPassword = await this.hashPassword(createUsersDto.password);

    // Email verification token oluştur
    const emailVerificationToken = this.generateVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    const userWithHashedPassword = {
      ...createUsersDto,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: false,
    };

    const createdUser = new this.userModel(userWithHashedPassword);
    const savedUser = await createdUser.save();

    return {
      user: savedUser,
      emailVerificationToken,
    };
  }

  async verifyEmail(token: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException(
        'Geçersiz veya süresi dolmuş verification token',
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    return await user.save();
  }

  async resendVerificationEmail(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email adresi zaten doğrulanmış');
    }

    // Yeni verification token oluştur
    const emailVerificationToken = this.generateVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;

    await user.save();
    return emailVerificationToken;
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'Bu email adresine sahip kullanıcı bulunamadı',
      );
    }

    // Password reset token oluştur
    const passwordResetToken = this.generateVerificationToken();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;

    await user.save();
    return passwordResetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş reset token');
    }

    // Yeni şifreyi hash'le ve kaydet
    user.password = await this.hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();
  }

  // Sistemde hiç kullanıcı var mı kontrol et
  async hasAnyUsers(): Promise<boolean> {
    const count = await this.userModel.countDocuments();
    return count > 0;
  }

  async updateUser(
    id: string,
    updateUsersDto: CreateUsersDto,
    currentUser?: UserDocument,
  ): Promise<User> {
    // Sadece admin veya kendi profilini güncelleyebilir
    if (
      currentUser &&
      currentUser.role !== UserRole.ADMIN &&
      currentUser._id.toString() !== id
    ) {
      throw new ForbiddenException('Bu kullanıcıyı güncelleme yetkiniz yok');
    }

    // Eğer şifre güncelleniyorsa hash'le
    const updateData = updateUsersDto.password
      ? {
          ...updateUsersDto,
          password: await this.hashPassword(updateUsersDto.password),
        }
      : updateUsersDto;

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }
    return updatedUser;
  }

  async removeUser(id: string, currentUser?: UserDocument): Promise<User> {
    // Sadece admin silebilir
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Kullanıcı silme yetkiniz yok');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`Kullanıcı ${id} bulunamadı`);
    }

    return deletedUser;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  // Password hash işlemleri
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Güvenlik seviyesi
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Email verification token oluştur
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
