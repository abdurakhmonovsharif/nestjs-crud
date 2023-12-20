import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard) 
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @HttpCode(201)
  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }
  @HttpCode(201)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateUser(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.updateUser(id, user);
  }
  @HttpCode(200)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
