import {
  IsString,
  IsOptional,
  MinLength,
  IsUrl,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username?: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;
}
