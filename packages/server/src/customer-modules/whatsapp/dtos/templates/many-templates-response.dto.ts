import { Field, ObjectType } from "@nestjs/graphql";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";


@ObjectType()
export class ManyTemplatesResponse {
  @Field(() => [WhatsAppTemplate])
  templates: WhatsAppTemplate[];

  @Field()
  total: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}
