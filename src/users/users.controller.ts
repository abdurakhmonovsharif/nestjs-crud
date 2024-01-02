import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @HttpCode(200)
  @Get()
  // @UseGuards(AuthGuard) 
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
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    try {
      const deletedUser = await this.userService.deleteUser(id)
      if (!deletedUser) {
        response.status(404).json({ message: "User not found!" })
      }
      response.status(200).json({ message: "User successfully deleted." })
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  }
}
