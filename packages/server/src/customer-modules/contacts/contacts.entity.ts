import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Message } from "../channel/message.entity";
import { Channel } from "../channel/channel.entity";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Workspace } from "src/modules/workspace/workspace.entity";



@Entity({ name: 'contacts'})
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
  channel : Relation<Channel[]>

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profileImg?: string;


  @CreateDateColumn()
  @Field() // If using GraphQL
  createdAt: Date;

    // @Field(() => Workspace)
    // @ManyToOne(() => Workspace)
    // workspace : Relation<Workspace>

    @Column({ type: 'boolean', default: false, nullable : true })
    @Field(() => Boolean)
    defaultContact: boolean;

}