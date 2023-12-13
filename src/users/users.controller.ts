import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(200)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @HttpCode(201)
  @Post()
  async createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }
  @HttpCode(201)
  @Put(":id")
  async updateUser(@Param("id") id :string, @Body() user: UserDto) {
    return this.userService.updateUser(id,user);
  }
}
