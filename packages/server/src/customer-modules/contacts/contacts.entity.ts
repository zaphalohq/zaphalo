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
import { Message } from "src/customer-modules/channel/message.entity";
import { Channel } from "src/customer-modules/channel/channel.entity";
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

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.sender)
  messages: Relation<Message[]>;

  @Field(() => [Channel])
  @ManyToMany(() => Channel, channel => channel.contacts)
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