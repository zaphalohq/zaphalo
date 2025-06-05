import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Relation } from 'typeorm';
import { Contacts } from '../contacts/contacts.entity';
import { User } from '../user/user.entity';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { Workspace } from '../workspace/workspace.entity';
import { MailingContacts } from './mailingContacts.entity';

@Entity({ name: 'MailingList', schema: 'core' })
@ObjectType()
export class MailingList {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mailingListName: string;

  @Field(() => [MailingContacts])
  @OneToMany(() => MailingContacts, MailingContacts => MailingContacts.mailingList)
  mailingContacts : Relation<MailingContacts[]>
  
  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace : Relation<Workspace>

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;


}