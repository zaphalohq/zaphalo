import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation
} from 'typeorm';
import { Message } from './message.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { Contacts } from 'src/customer-modules/contacts/contacts.entity';

@Entity({ name: 'channel' })
@ObjectType()
export class Channel {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  channelName: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  writeDate: Date;

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.channel)
  messages: Relation<Message[]>

  @Field(() => [Contacts])
  @ManyToMany(() => Contacts, contacts => contacts.channel)
  @JoinTable({
    name: 'channel_contacts',
    joinColumn: { name: 'channelId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
  })
  channelMembers: Relation<Contacts[]>;

}