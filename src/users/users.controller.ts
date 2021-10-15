import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  @Post('/signup')
  createUser() {}
}
