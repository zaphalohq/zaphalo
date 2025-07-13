import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { MailingList } from "src/customer-modules/mailingList/mailingList.entity";

@Entity({ name: 'attachment' })
@ObjectType('attachment')
export class Attachment {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  originalname: string;

  @Column()
  @Field(() => String)
  fullPath: string;

  @Column()
  @Field(() => String)
  type: string;

  @Column({type: 'bigint'})
  @Field(() => Number)
  size: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;


  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => MailingList)
  @JoinColumn()
  @Field(() => MailingList, { nullable: true })
  waTemplateId: Relation<MailingList>;
}