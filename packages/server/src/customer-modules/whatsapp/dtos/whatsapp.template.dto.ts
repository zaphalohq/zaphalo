import { InputType, Field } from '@nestjs/graphql';

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
  account: string;

  @Field()
  templateName: string;

  @Field()
  category: string;

  @Field()
  language: string;

  @Field({ nullable: true })
  headerType: string;

  @Field({ nullable: true })
  bodyText: string;

  @Field({ nullable: true })
  footerText: string;

  @Field({ nullable: true })
  header_handle: string;

  @Field({ nullable: true })
  fileUrl: string;

  @Field(() => [WaButtonInput], { nullable: true })
  button: WaButtonInput[];

  @Field(() => [WaVariableInput], { nullable: true })
  variables: WaVariableInput[];
}


@InputType()
export class WaSendInput {
  @Field()
  number: string;
}
