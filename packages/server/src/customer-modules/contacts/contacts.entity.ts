import { Field, Float, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";

import { Message } from "src/customer-modules/channel/entities/message.entity";
import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";



@Entity({ name: 'contacts' })
@ObjectType('contacts')
export class Contacts {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field()
  contactName: string;

  @Column({ type: 'bigint' })
  @Field(() => Float)
  phoneNo: number;

  @Field(() => [Channel])
  @ManyToMany(() => Channel, channel => channel.channelMembers)
  @JoinColumn({ name: 'channel' })
  channel: Relation<Channel[]>

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profileImg?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Field(() => Boolean)
  defaultContact: boolean;

}