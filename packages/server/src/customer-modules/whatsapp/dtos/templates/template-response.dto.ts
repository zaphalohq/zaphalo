import { Field, ObjectType } from "@nestjs/graphql";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";

@ObjectType()
export class TemplateResponse {
  @Field(() => WhatsAppTemplate, { nullable: true })
  template?: WhatsAppTemplate;

  @Field()
  status: boolean;

  @Field()
  message: string;
}
