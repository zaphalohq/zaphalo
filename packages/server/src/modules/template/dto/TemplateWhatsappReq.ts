import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class TemplateWhatsappReq {
  @Field()
  templateId: string;

  @Field()
  templateName: string;

  @Field()
  mailingListId: string;

  @Field()
  mailingListName: string;

  @Field(() => [String], { nullable: true })
  variables?: string[];

  @Field({ nullable: true })
  URL?: string;

  @Field()
  headerType: string;

  @Field()
  language: string;
}
