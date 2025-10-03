import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation
} from 'typeorm';
import { MailingList } from './mailingList.entity';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';

@Entity({ name: 'MailingContacts' })
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
    @ManyToOne(() => MailingList, MailingList => MailingList.mailingContacts, {
        onDelete: 'CASCADE'
    })
    mailingList: Relation<MailingList>

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
}