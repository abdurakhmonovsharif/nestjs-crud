import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers() {
    return this.userModel.find({});
  }
  async createUser(user: UserDto) {
    const isExists = await this.userModel.findOne({ username: user.username });
    if (isExists) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    return this.userModel.create(user);
  }
  async updateUser(id: string, user: UserDto) {
    const isExists =await this.userModel.findOne({_id:id});
    console.log(isExists);
    if (!isExists) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return this.userModel.findByIdAndUpdate(id,user,{new:true});
  }
}
