import { InputType, Field } from '@nestjs/graphql';
import { TemplateHeaderType, TemplateCategory, TemplateLanguage } from '../entities/whatsapp-template.entity';

@InputType()
export class WaVariableInput {
  @Field()
  name: string;

  @Field()
  value: string;
}

@InputType()
export class WaButtonInput {
  @Field()
  type: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  phone_number: string;
}

@InputType()
export class WaTemplateRequestInput {
  @Field({ nullable: true})
  templateId?: string;

  @Field({ nullable: false})
  whatsappAccountId?: string;

  @Field()
  templateName: string;

  @Field(() => TemplateCategory)
  category: TemplateCategory;

  @Field(() => TemplateLanguage)
  language: TemplateLanguage;

  @Field({ nullable: true })
  bodyText: string;

  @Field(() => TemplateHeaderType, { nullable: true })
  headerType?: TemplateHeaderType;

  @Field({ nullable: true })
  headerText?: string;

  @Field({ nullable: true })
  footerText?: string;

  @Field(() => [WaButtonInput], { nullable: true })
  button?: WaButtonInput[];

  @Field(() => [WaVariableInput], { nullable: true })
  variables?: WaVariableInput[];

  @Field({ nullable: true })
  attachmentId?: string;
}


@InputType()
export class WaSendInput {
  @Field()
  number: string;
}
