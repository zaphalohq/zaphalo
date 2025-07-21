import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column()
  @Field(() => String)
  totalBroadcastSend: string;

  @OneToOne(() => WhatsAppTemplate)
  @JoinColumn()
  @Field(() => WhatsAppTemplate, { nullable: true })
  template: Relation<WhatsAppTemplate>;

  @OneToOne(() => MailingList)
  @JoinColumn()
  @Field(() => MailingList, { nullable: true })
  mailingList: Relation<MailingList>;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Field(() => Boolean)
  isBroadcastDone: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

}