import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@Entity('fcm_tokens')
@ObjectType('FcmToken')
export class FcmToken {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) 
  id: string;

  @Column()
  @Field(() => String) 
  token: string;

  @ManyToOne(() => User, (user) => user.fcmTokens, { onDelete: 'CASCADE' })
  @Field(() => User) 
  user: User;

  @Column()
  @Field(() => String) 
  userId: string;

  @Column()
  @Field(()=>String)
  workspaceId: string;

  @CreateDateColumn()
  @Field(() => Date) 
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date) 
  updatedAt: Date;
}