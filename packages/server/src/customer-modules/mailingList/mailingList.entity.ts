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

@Entity({ name: 'MailingList' })
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
  mailingContacts: Relation<MailingContacts[]>

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}