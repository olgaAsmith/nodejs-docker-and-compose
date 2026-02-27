import { IsString, IsEmail, Length, IsUrl, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
