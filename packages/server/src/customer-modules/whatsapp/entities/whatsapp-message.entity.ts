import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { WhatsAppAccount } from 'src/customer-modules/whatsapp/entities/whatsapp-account.entity';
import { Message } from 'src/customer-modules/channel/entities/message.entity';
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";


export enum messageTypes {
  OUTBOUND = 'Outbound',
  INBOUND = 'Inbound',
}

registerEnumType(messageTypes, { name: 'messageTypes' });

export enum messageStates {
  outgoing = 'In Queue',
  sent = 'Sent',
  delivered = 'Delivered',
  read = 'Read',
  replied = 'Replied',
  received = 'Received',
  error = 'Failed',
  bounced = 'Bounced',
  cancel = 'Cancelled',
}

registerEnumType(messageStates, { name: 'messageStates' });

export enum messageFailureTypes {
  account = 'Account Error',
  blacklisted = 'Blacklisted Phone Number',
  network = 'Network Error',
  outdated_channel = 'The channel is no longer active',
  phone_invalid = 'Wrong Number Format',
  template = 'Template Quality Rating Too Low',
  unknown = 'Unknown Error',
  whatsapp_recoverable = 'Identified Error',
  whatsapp_unrecoverable = 'Other Technical Error'
}
registerEnumType(messageFailureTypes, { name: 'messageFailureTypes' });


@Entity({ name: 'whatsAppMessage'})
@ObjectType('whatsAppMessage')
export class WhatsAppMessage {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field()
  mobileNumber: string;

  @Column({ type: 'enum', enum: messageTypes, default: messageTypes.OUTBOUND})
  messageType: messageTypes;

  @Column({ type: 'enum', enum: messageStates, default: messageStates.outgoing})
  state: messageStates;

  @Column({ type: 'enum', enum: messageFailureTypes, nullable: true})
  messageFailureType: messageFailureTypes;

  @Column({nullable: true})
  @Field()
  failureReason: string;

  @Column({ nullable: true })
  @Field()
  freeTextJson: string;

  @ManyToOne(() => WhatsAppTemplate)
  @JoinColumn()
  @Field(() => WhatsAppTemplate, { nullable: true })
  waTemplateId: Relation<WhatsAppTemplate>;

  @Column({nullable: true})
  @Field()
  msgUid: string;

  @ManyToOne(() => WhatsAppAccount)
  @JoinColumn()
  @Field(() => WhatsAppAccount, { nullable: true })
  waAccountId: Relation<WhatsAppAccount>;

  @ManyToOne(() => WhatsAppMessage, { nullable: true })
  @JoinColumn()
  @Field(() => WhatsAppMessage, { nullable: true })
  parentId: Relation<WhatsAppMessage>;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn()
  @Field(() => Message, { nullable: true })
  channelMessageId: Relation<Message>;

  @Column({ nullable: true })
  @Field()
  body: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;
}