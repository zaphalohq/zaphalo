import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from 'typeorm';
import { MailingContacts } from './mailingContacts.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { Broadcast } from '../broadcast/broadcast.entity';

@Entity({ name: 'MailingList' })
@ObjectType()
export class MailingList {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mailingListName: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  totalContacts: number;


  @Field(() => [MailingContacts])
  @OneToMany(() => MailingContacts, MailingContacts => MailingContacts.mailingList,{
    cascade:true,
  })
  mailingContacts: Relation<MailingContacts[]>

  @Field(()=>[Broadcast])
  @OneToMany(()=>Broadcast,broadcast => broadcast.contactList)
  broadcast: Relation<Broadcast[]>

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}