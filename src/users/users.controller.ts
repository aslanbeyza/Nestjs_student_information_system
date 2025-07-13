import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';

@Controller('users') //http://localhost:3000/users olcak url yani
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get() //getr request ise alttaki fonk çalıştırıcam diyor
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
  @Get(':id') //http://localhost:3000/users/123 olcak url yani
  getOneUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getOneUserById(id);
  }
  @Post()
  createUser(@Body() createUsersDto: CreateUsersDto): Promise<User> {
    return this.usersService.createUser(createUsersDto);
  }
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() createUsersDto: CreateUsersDto,
  ): Promise<User> {
    console.log(id, createUsersDto);
    return this.usersService.updateUser(id, createUsersDto);
  }
  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }
}
