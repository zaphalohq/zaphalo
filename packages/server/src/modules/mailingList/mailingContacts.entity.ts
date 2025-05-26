import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Relation } from 'typeorm';
import { Contacts } from '../contacts/contacts.entity';
import { User } from '../user/user.entity';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { Workspace } from '../workspace/workspace.entity';
import { MailingList } from './mailingList.entity';

@Entity({ name: 'MailingContacts', schema: 'core' })
@ObjectType()
export class MailingContacts {
    @IDField(() => UUIDScalarType)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column()
    contactName: string;

    @Field(() => String)
    @Column()
    contactNo: string;

    @Field(() => MailingList)
    @ManyToOne(() => MailingList, MailingList =>  MailingList.mailingContacts)
    mailingList: Relation<MailingList>

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
}