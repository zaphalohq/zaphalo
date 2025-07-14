import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";


@Entity({ name: 'whatsAppAccount'})
@ObjectType('whatsAppAccount')
export class WhatsAppAccount {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  appId: string;

  @Column()
  @Field()
  phoneNumberId: string;

  @Column()
  @Field()
  businessAccountId: string;

  @Column()
  @Field()
  accessToken: string;

  @Column()
  @Field()
  appSecret: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  defaultSelected: boolean;
}