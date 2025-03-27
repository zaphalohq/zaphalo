import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { Message } from "../channel/message.entity";
import { Channel } from "../channel/channel.entity";


@Entity({ name: 'contacts', schema: 'core' })
@ObjectType('contacts')
export class Contacts {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()                                // Regular database column
  @Field()                                 // GraphQL field
  contactName: string;

  @Column({ type: 'bigint' })
  @Field(() => Float)
  phoneNo: number;

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.sender)
  messages : Relation<Message[]>;

  @Field(() => [Channel])
  @ManyToMany(() => Channel, channel => channel.contacts)
  @JoinColumn({ name : 'channel'})
  channel : Channel[]

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profileImg?: string;

  @CreateDateColumn()
  @Field() // If using GraphQL
  createdAt: Date;


}