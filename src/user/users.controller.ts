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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: UserDocument;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve all users from the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [User]
  })
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('by-role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get users by role',
    description: 'Retrieve users filtered by role (Admin only)'
  })
  @ApiQuery({ 
    name: 'role', 
    enum: UserRole,
    description: 'User role to filter by'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [User]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  getUsersByRole(@Query('role') role: UserRole): Promise<User[]> {
    return this.usersService.getUsersByRole(role);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getOneUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getOneUserById(id);
  }

  @Public()
  @Post()
  @ApiOperation({ 
    summary: 'Create user',
    description: 'Create a new user account'
  })
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      properties: {
        message: { type: 'string' },
        user: { 
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
            emailVerified: { type: 'boolean' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Delete a user (Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeUser(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.usersService.removeUser(id, req.user);
  }
}
