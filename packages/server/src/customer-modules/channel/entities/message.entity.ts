import { Field, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Relation,
  OneToOne
} from 'typeorm';
import { Channel } from './channel.entity';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Contacts } from 'src/customer-modules/contacts/contacts.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { Attachment } from 'src/customer-modules/attachment/attachment.entity';

@Entity({ name: 'messages' })
@ObjectType()
export class Message {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  messageType: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  waMessageId: string;

  @Field(() => String, { nullable: true })
  @Column()
  textMessage: string;

  @Field(() => Channel)
  @ManyToOne(() => Channel, channel => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Relation<Channel>;

  @Field(() => Contacts, { nullable: true })
  @ManyToOne(() => Contacts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'senderId' })
  sender: Relation<Contacts>;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  attachmentUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false, nullable: false })
  unseen: boolean;

  @Field(() => Attachment, { nullable: true })
  @OneToOne(() => Attachment, { nullable: true })
  @JoinColumn({ name: 'attachmentId' })
  attachment: Relation<Attachment>;
}