import { Field, ObjectType, Int } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { MailingList } from "src/customer-modules/mailingList/mailingList.entity";
import { WhatsAppAccount } from "../whatsapp/entities/whatsapp-account.entity";
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"

@Entity({ name: 'broadcast' })
@ObjectType('broadcast')
export class Broadcast {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Field(() => WhatsAppAccount)
  @ManyToOne(() => WhatsAppAccount)
  whatsappAccount: Relation<WhatsAppAccount>;

  @ManyToOne(() => WhatsAppTemplate)
  @Field(() => WhatsAppTemplate)
  template: Relation<WhatsAppTemplate>;

  @ManyToOne(() => MailingList)
  @Field(() => MailingList)
  contactList: Relation<MailingList>;

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  scheduledAt?: Date;

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  completedAt?: Date;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  totalContacts: number;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  sentCount: number;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  failedCount: number;

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

  @Column({ type: 'enum', enum: broadcastStates, default: broadcastStates.new})
  @Field()
  status: broadcastStates;
}