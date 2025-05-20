import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Relation } from 'typeorm';
import { Message } from './message.entity';
import { Contacts } from '../contacts/contacts.entity';
import { User } from '../user/user.entity';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { Workspace } from '../workspace/workspace.entity';

@Entity({ name: 'channel', schema: 'core' })
@ObjectType()
export class Channel {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  channelName: string;

  @Field(() => [Contacts])
  @ManyToMany(() => Contacts, contacts => contacts.channel)
  @JoinTable({
    name: 'channel_contacts',
    joinColumn: { name: 'channelId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
  })
  contacts: Relation<Contacts[]>;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  writeDate: Date;

  @Field(() => [User], { nullable : false})
  @ManyToOne(() => User, { nullable : false})
  writeUser: Relation<User>;

  @Field(() => User, { nullable : true})
  @ManyToOne(() => User, { nullable : true})
  createUser: Relation<User>;

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.channel)
  messages : Relation<Message[]>
  
  @Field(() => String)
  @Column({ nullable : true })
  membersidsss : string

  @Field(() => Workspace)
  @ManyToOne(() => Workspace, workspace => workspace.channels)
  workspace : Relation<Workspace>
}