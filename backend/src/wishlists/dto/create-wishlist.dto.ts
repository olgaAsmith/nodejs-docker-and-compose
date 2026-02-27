import {
  IsString,
  Length,
  IsUrl,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(0, 1500)
  @IsOptional()
  description?: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  itemsId?: number[];
}
