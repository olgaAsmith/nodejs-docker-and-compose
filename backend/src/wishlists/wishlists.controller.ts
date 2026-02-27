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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/auth.controller';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getWishlist() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getWishlistById(@Param('id') id: number) {
    return await this.wishlistsService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateWishlistById(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.updateOne(
      { id },
      updateWishlistDto,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteWishlistById(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ) {
    await this.wishlistsService.removeOne(id, req.user.id);
    return {};
  }
}
