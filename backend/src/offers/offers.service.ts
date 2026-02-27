import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishRepository.findOne({
      where: { id: dto.itemId },
      relations: {
        owner: true,
      },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException('You cannot offer your wish');
    }

    const raised = Number(wish.raised);
    const amount = Number(dto.amount);
    const price = Number(wish.price);

    if (price < raised + amount) {
      throw new BadRequestException('Your offer is too much');
    }

    wish.raised = raised + amount;
    await this.wishRepository.save(wish);

    const offer = this.offersRepository.create({
      amount,
      hidden: dto.hidden,
      item: wish,
      user,
    });

    return this.offersRepository.save(offer);
  }

  async findOne(filter: Partial<Offer>): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: filter,
      relations: {
        user: true,
      },
      loadRelationIds: {
        relations: ['item'],
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      relations: {
        user: true,
      },
      loadRelationIds: {
        relations: ['item'],
      },
    });
  }
}
