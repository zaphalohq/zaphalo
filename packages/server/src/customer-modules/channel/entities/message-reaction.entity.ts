import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { Channel } from './channel.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { Contacts } from 'src/customer-modules/contacts/contacts.entity';

@Entity({ name: 'channelMessageReaction' })
@ObjectType()
export class MessageReaction {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Contacts)
  @ManyToOne(() => Contacts, (contact) => contact.messages, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'senderId' })
  contact: Relation<Contacts>;

  @Field(() => String, { nullable: true })
  @Column()
  content: string;

  @Field(() => Message)
  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelMessageId' })
  channelMessage: Relation<Message>;

  @Field(() => String, { nullable: true })
  @Column()
  contactName: string;

}