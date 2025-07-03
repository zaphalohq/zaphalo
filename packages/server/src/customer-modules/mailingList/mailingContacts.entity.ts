import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Relation } from 'typeorm';
import { MailingList } from './mailingList.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';

@Entity({ name: 'MailingContacts'})
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