import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsUrl()
  link: string;

  @Column({ nullable: true })
  @IsUrl()
  image: string;

  @Column('decimal', { precision: 12, scale: 2 })
  @IsNumber()
  @Min(0)
  price: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true })
  owner: User;

  @Column({ length: 1024, nullable: true })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  copied: number;
}
