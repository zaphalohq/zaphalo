import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { MailingList } from "src/customer-modules/mailingList/mailingList.entity";

@Entity({ name: 'broadcast' })
@ObjectType('broadcast')
export class Broadcast {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  broadcastName: string;

  @OneToOne(() => WhatsAppTemplate)
  @JoinColumn()
  @Field(() => WhatsAppTemplate, { nullable: true })
  template: Relation<WhatsAppTemplate>;

  @OneToOne(() => MailingList)
  @JoinColumn()
  @Field(() => MailingList, { nullable: true })
  mailingList: Relation<MailingList>;

  @Column("text", { array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  variables?: string[];

  @Column()
  @Field({ nullable: true })
  URL?: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Field(() => Boolean)
  isBroadcastDone: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

}