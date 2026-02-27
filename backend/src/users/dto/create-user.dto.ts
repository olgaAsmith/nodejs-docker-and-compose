import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly username: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @MinLength(2)
  @MaxLength(200)
  readonly about?: string;

  @IsUrl()
  @IsOptional()
  readonly avatar?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(4)
  readonly password: string;
}
