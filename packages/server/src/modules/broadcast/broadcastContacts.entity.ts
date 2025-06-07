import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { Workspace } from "../workspace/workspace.entity";
import { Template } from "../template/template.entity";
import { MailingList } from "../mailingList/mailingList.entity";
import { MailingContacts } from "../mailingList/mailingContacts.entity";
import { Broadcast } from "./broadcast.entity";


@Entity({ name: 'broadcastContacts', schema: 'core' })
@ObjectType('broadcastContacts')
export class BroadcastContacts {
    @IDField(() => UUIDScalarType)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Broadcast)
    @JoinColumn()
    @ManyToOne(() => Broadcast)
    broadcast: Relation<Broadcast>

    @Column()
    @Field(() => String)
    contactNo: string;

    @Column({ default: 'PENDING' })
    @Field(() => String)
    status: string;


    @CreateDateColumn()
    @Field()
    createdAt: Date;
}