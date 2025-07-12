import { Controller, Get } from '@nestjs/common';

@Controller('users') //http://localhost:3000/users olcak url yani
export class UsersController {
  @Get() //getr request ise alttaki fonk çalıştırıcam diyor
  getAllUsers() {
    return 'get all persons';
  }
}
