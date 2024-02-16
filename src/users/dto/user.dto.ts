import { IsNotEmpty, IsString } from 'class-validator';
export class UserDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  email: string;
}
