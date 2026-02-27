import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email or username already exists');
      }
      throw error;
    }

    return this.findOne({ id: user.id });
  }

  async findOne(filter: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: filter });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findMany(filter?: string): Promise<User[]> {
    if (!filter) return this.usersRepository.find();

    const value = `%${filter}%`;

    return this.usersRepository.find({
      where: [{ username: ILike(value) }, { email: ILike(value) }],
    });
  }

  async findMe(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'about',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email or username already exists');
      }
      throw error;
    }

    return this.findOne({ id });
  }

  async findOneWithPassword(filter: Partial<User>): Promise<User | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(filter)
      .getOne();

    return user;
  }
}
