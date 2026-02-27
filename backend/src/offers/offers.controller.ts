import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestWithUser } from 'src/auth/auth.controller';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: RequestWithUser,
  ) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAllOffers() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getOfferById(@Param('id') id: number) {
    return this.offersService.findOne({ id });
  }
}
