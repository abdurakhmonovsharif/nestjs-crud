import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}
  @HttpCode(200)
  @Post('login')
  async login(@Body() user:UserDto) {
    // return this.auth_service.loginUser(user.username,user.password);
  }
  @HttpCode(200)
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() user: UserDto) {
    return this.auth_service.registerUser(user);
  }
}
