import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import GraphQLJSON from "graphql-type-json";

@Entity({ name: 'whatsAppTemplate' })
@ObjectType('whatsAppTemplate')
export class WhatsAppTemplate {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  account?: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  templateName?: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  status?: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  templateId?: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  category?: string;

  @Column({ nullable: true})
  @Field({ nullable: true})
  language?: string;

  @Column('jsonb', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  rawComponents?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}


// @ObjectType()
// class Button {
//   @Field()
//   type: string;

//   @Field()
//   text: string;

//   @Field({ nullable: true })
//   url?: string;

//   @Field({ nullable: true })
//   phone_number?: string;
// }


// @ObjectType()
// class Variable {
//   @Field()
//   name: string;

//   @Field()
//   value: string;
// }