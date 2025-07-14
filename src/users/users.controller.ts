import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { UserRole } from './dto/user-role-enum';
import { Roles } from './dto/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserDocument } from './schemas/users.schema';
import { Public } from '../auth/public.decorator';
import { EmailService } from '../auth/email.service';

interface RequestWithUser extends Request {
  user: UserDocument;
}

@Controller('users') //http://localhost:3000/users olcak url yani
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Public() // Herkes tüm kullanıcıları görebilir
  @Get() //get request ise alttaki fonk çalıştırıcam diyor
  // Guard yok - Herkes tüm kullanıcıları görebilir
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('by-role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Sadece admin role'e göre filtreleme yapabilir
  getUsersByRole(@Query('role') role: UserRole): Promise<User[]> {
    return this.usersService.getUsersByRole(role);
  }

  @Get(':id') //http://localhost:3000/users/123 olcak url yani
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // Herkes kendi profilini görebilir
  getOneUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getOneUserById(id);
  }

  @Public() // İlk admin oluşturma sistemi için public
  @Post()
  // Guard yok - Service içinde kontrol ediyoruz (ilk kullanıcı admin olur)
  async createUser(
    @Body() createUsersDto: CreateUsersDto,
  ): Promise<{ message: string; user: any }> {
    const result = await this.usersService.createUser(createUsersDto);

    // Email verification gönder
    await this.emailService.sendVerificationEmail(
      result.user.email,
      result.emailVerificationToken,
    );

    // Password ve token'ı response'dan çıkar - güvenli object oluştur
    const userObject = result.user.toObject();
    const safeUser = {
      _id: userObject._id,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      email: userObject.email,
      phone: userObject.phone,
      role: userObject.role,
      emailVerified: userObject.emailVerified,
    };

    return {
      message: 'Kullanıcı oluşturuldu. Email doğrulama linki gönderildi.',
      user: safeUser,
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // Admin herkesi, diğerleri kendilerini güncelleyebilir
  updateUser(
    @Param('id') id: string,
    @Body() createUsersDto: CreateUsersDto,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    console.log(id, createUsersDto);
    return this.usersService.updateUser(id, createUsersDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Sadece admin kullanıcı silebilir
  removeUser(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.usersService.removeUser(id, req.user);
  }
}
