import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,

    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    let items: Wish[] = [];

    if (createWishlistDto.itemsId?.length) {
      items = await this.wishesRepository.find({
        where: { id: In(createWishlistDto.itemsId) },
      });
    }

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(filter: Partial<Wishlist>): Promise<Wishlist | null> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: filter,
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async updateOne(
    filter: Partial<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(filter);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('It is not your wishlist');
    }

    let items: Wish[] | undefined;

    if (updateWishlistDto.itemsId?.length) {
      items = await this.wishesRepository.find({
        where: { id: In(updateWishlistDto.itemsId) },
      });
    }

    Object.assign(wishlist, {
      ...updateWishlistDto,
      items: items ?? wishlist.items,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(id: number, userId: number): Promise<void> {
    const wishlist = await this.findOne({ id });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('It is not your wishlist');
    }

    await this.wishlistsRepository.delete(id);
  }
}
