import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/auth.controller';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}
  @UseGuards(JwtGuard)
  @Get('/me')
  async getProfile(@Req() req: RequestWithUser) {
    return this.usersService.findMe(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  async getMyWishes(@Req() req: RequestWithUser) {
    return await this.wishesService.findUserWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/:username')
  async getByUsername(@Param('username') username: string) {
    return await this.usersService.findOne({ username });
  }

  @UseGuards(JwtGuard)
  @Get('/:username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.wishesService.findByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  async findUsers(@Body('query') query?: string) {
    return this.usersService.findMany(query);
  }
}
