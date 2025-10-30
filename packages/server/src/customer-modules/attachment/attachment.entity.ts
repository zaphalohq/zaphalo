import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";

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
  path: string;

  @Column()
  @Field(() => String)
  mimetype: string;

  @Column({ type: 'bigint' })
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

  @Field(() => [WhatsAppTemplate])
  @OneToMany(() => WhatsAppTemplate, template => template.attachment)
  template: Relation<WhatsAppTemplate[]>

}