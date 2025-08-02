import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { MailingList } from "src/customer-modules/mailingList/mailingList.entity";
import { WhatsAppAccount } from "../whatsapp/entities/whatsapp-account.entity";

@Entity({ name: 'broadcast' })
@ObjectType('broadcast')
export class Broadcast {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => WhatsAppAccount)
  @ManyToOne(() => WhatsAppAccount)
  account: Relation<WhatsAppAccount>;

  @Column()
  @Field(() => String)
  broadcastName: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  totalBroadcast: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  totalBroadcastSend: string;

  @ManyToOne(() => WhatsAppTemplate)
  @Field(() => WhatsAppTemplate)
  template: Relation<WhatsAppTemplate>;

  @ManyToOne(() => MailingList)
  @Field(() => MailingList)
  mailingList: Relation<MailingList>;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Field(() => Boolean)
  isBroadcastDone: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

}