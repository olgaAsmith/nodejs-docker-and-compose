import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishesRepository.save(wish);
  }

  async findOne(filter: Partial<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: filter,
      relations: {
        offers: {
          user: true,
        },
      },
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne({ id });

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('It is not your wish');
    }

    if (
      wish.raised > 0 &&
      updateWishDto.price !== undefined &&
      Number(updateWishDto.price) !== Number(wish.price)
    ) {
      throw new ForbiddenException(
        'You wish has offer. So price is not changable',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async removeOne(id: number, userId: number): Promise<{ success: true }> {
    const wish = await this.findOne({ id });

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('It is not your wish');
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException('You can not delete wish with offer');
    }

    await this.wishesRepository.delete({ id });
    return { success: true };
  }

  async findLast(limit: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      relations: {
        offers: {
          user: true,
        },
      },
    });
  }

  async findTop(limit: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        copied: 'DESC',
        createdAt: 'DESC',
      },
      take: limit,
      relations: {
        offers: {
          user: true,
        },
      },
    });
  }

  async findUserWishes(userId: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: {
        offers: {
          user: true,
        },
      },
    });
  }

  async findByUsername(username: string): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: {
        owner: { username },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne({ id });

    await this.wishesRepository.increment({ id }, 'copied', 1);

    const wishDto: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    return this.create(wishDto, user);
  }
}
