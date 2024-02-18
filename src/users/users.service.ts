import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async getAllUsers() {
    return this.userModel.find({});
  }
  async getUsersByLimitAndPage(limit:number,page:number=1){
    const skip = (page - 1) * limit;
    return this.userModel.find().skip(skip).limit(limit).exec();
  }
  async getUsersByLimit(limit:number){
    return this.userModel.find().limit(limit).exec();
  }
  async getUsersByDefaultLimitAndPage(page:number){
    const defaultLimit = 10;
    const skip = (page - 1) * defaultLimit;
    return this.userModel.find().skip(skip).limit(defaultLimit).exec();
  }

  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username: username });
  }
  async createUser(user: UserDto) {
    // const isExists = await this.userModel.findOne({ username: user.username });
    // if (isExists) {
    //   throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    // }
    let result = (await this.userModel.create(user)).toJSON()
    delete result.__v
    return result;
  }

  async updateUser(id: string, user: UserDto) {
    const isExists = await this.userModel.findOne({ _id: id });
    if (!isExists) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    let result = (await this.userModel.findByIdAndUpdate(id, user, { new: true })).toJSON()
    delete result.__v;
    return result;
  }

  async deleteUser(_id: string) {
    const isExists = await this.userModel.findOne({ _id });
    if (!isExists) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return this.userModel.findByIdAndDelete(_id);
  }
}
