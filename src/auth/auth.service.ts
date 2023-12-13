import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async registerUser(user: UserDto) {
    const isExists = await this.usersService.getUserByUsername(user.username);
    if (isExists) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt();
    const passwordHas = await bcrypt.hash(user.password, salt);
    const createdUser = await this.usersService.createUser({
      ...user,
      password: passwordHas,
    });
    const payload = {
      sub: createdUser._id,
      username: createdUser.username,
    };
    return {
      user: createdUser,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async loginUser(username: string, password: string) {
    const findedUserByUsername = (
      await this.usersService.getUserByUsername(username)
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
