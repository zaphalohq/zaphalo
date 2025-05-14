// src/channel/message.entity.ts
import { Field, Float } from '@nestjs/graphql';
import { Contacts } from 'src/modules/contacts/contacts.entity';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Relation } from 'typeorm';
import { Channel } from './channel.entity';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { ObjectType } from '@nestjs/graphql'; // Import ObjectType

@Entity({ name: 'messages', schema: 'core' })
@ObjectType() // Add this
export class Message {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  message: string;


  @Field(() => Channel)
  @ManyToOne(() => Channel , channel => channel.messages, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Field(() => Contacts)
  @ManyToOne(() => Contacts, (contact) => contact.messages, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'senderId' })
  sender: Relation<Contacts>;

  @Field(() => String, { nullable: true }) // Add nullable: true for consistency
  @Column({ nullable: true })
  attachment: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}