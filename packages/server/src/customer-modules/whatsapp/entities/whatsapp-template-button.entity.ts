import { Field, ObjectType } from "@nestjs/graphql";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { WhatsAppTemplate } from "./whatsapp-template.entity";

@Entity({ name: 'whatsappTemplateButton' })
@ObjectType()
export class Button {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => UUIDScalarType)
  id: string;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field()
  text: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone_number?: string;

  @ManyToOne(() => WhatsAppTemplate, (template) => template.buttons, { onDelete: 'CASCADE' })
  template: Relation<WhatsAppTemplate>;
}