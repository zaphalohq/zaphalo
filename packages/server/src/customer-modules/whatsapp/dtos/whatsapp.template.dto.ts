import { InputType, Field } from '@nestjs/graphql';
import { HeaderType, TemplateCategory, TemplateLanguage } from '../entities/whatsapp-template.entity';

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
  @Field()
  accountId: string;

  @Field()
  templateName: string;

  @Field(() => TemplateCategory)
  category: TemplateCategory;

  @Field(() => TemplateLanguage)
  language: TemplateLanguage;

  @Field({ nullable: true })
  bodyText: string;

  @Field(() => HeaderType, { nullable: true })
  headerType?: HeaderType;

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
