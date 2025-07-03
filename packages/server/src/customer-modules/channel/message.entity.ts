import { Field, Float } from '@nestjs/graphql';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Relation 
} from 'typeorm';
import { Channel } from './channel.entity';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { Contacts } from '../contacts/contacts.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';

@Entity({ name: 'messages'})
@ObjectType()
export class Message {

  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  textMessage: string;

  @Field(() => Channel)
  @ManyToOne(() => Channel , channel => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Relation<Channel>;

  @Field(() => Contacts)
  @ManyToOne(() => Contacts, (contact) => contact.messages, { onDelete: 'SET NULL' })
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
}