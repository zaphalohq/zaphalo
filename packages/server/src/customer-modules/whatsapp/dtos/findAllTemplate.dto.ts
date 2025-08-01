import { Field, ObjectType } from "@nestjs/graphql";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";

@ObjectType()
export class FindAllTemplate {
  @Field(() => [WhatsAppTemplate])
  allTemplates: WhatsAppTemplate[];

  @Field()
  totalPages: number;

}
