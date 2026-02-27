import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/auth.controller';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestWithUser) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('/last')
  async getLast() {
    return this.wishesService.findLast(40);
  }

  @Get('/top')
  async getTop() {
    return this.wishesService.findTop(20);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getWishById(@Param('id') id: number) {
    return this.wishesService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateWishById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishesService.updateOne(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteWishById(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.wishesService.removeOne(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/copy')
  async copyWish(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.wishesService.copyWish(id, req.user);
  }
}
