// src/channel/message.entity.ts
import { Field, Float } from '@nestjs/graphql';
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
import { Contacts } from '../contacts/contacts.entity';

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
  @ManyToOne(() => Channel , channel => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Relation<Channel>;

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

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false, nullable: false }) // Explicitly define type and default
  unseen: boolean; // Use proper TypeScript type
}