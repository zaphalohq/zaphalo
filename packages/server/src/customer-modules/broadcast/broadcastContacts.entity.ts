import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Broadcast } from "./broadcast.entity";


@Entity({ name: 'broadcastContacts'})
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