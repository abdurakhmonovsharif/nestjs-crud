import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }
  async registerUser(user: UserDto) {
    const isExists = await this.userModel.findOne({ username: user.username });
    if (isExists) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    // const salt = await bcrypt.genSalt();
    // const passwordHas = await bcrypt.hash(user.password, salt);
    const createdUser = await this.userModel.create({
      ...user,
    });
    const payload = {
      sub: createdUser._id,
      username: createdUser.username,
    };
    const JsonUser = createdUser.toJSON();
    delete JsonUser.password;
    return {
      user: JsonUser,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async loginUser(username: string, password: string) {
    const findedUserByUsername = (
      await this.userModel.findOne({ username })
    ).toJSON();
    if (!findedUserByUsername) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(
      password,
      findedUserByUsername.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: findedUserByUsername._id,
      username: findedUserByUsername.username,
    };
    delete findedUserByUsername.password;
    return {
      user: findedUserByUsername,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
