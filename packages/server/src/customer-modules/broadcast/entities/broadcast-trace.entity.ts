import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  JoinColumn,
} from "typeorm";
import { Broadcast } from "src/customer-modules/broadcast/entities/broadcast.entity";
import { WhatsAppMessage } from 'src/customer-modules/whatsapp/entities/whatsapp-message.entity';
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";

@Entity({ name: 'broadcastTrace' })
@ObjectType('broadcastTrace')
export class BroadcastTrace {
    @IDField(() => UUIDScalarType)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Broadcast)
    @JoinColumn()
    @ManyToOne(() => Broadcast)
    broadcast: Relation<Broadcast>

    @Column()
    @Field(() => String)
    mobile: string;

    @Field(() => WhatsAppMessage)
    @JoinColumn()
    @ManyToOne(() => WhatsAppMessage)
    whatsAppMesssage: Relation<WhatsAppMessage>

    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    @Field()
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    @Field()
    updatedAt: Date;
}