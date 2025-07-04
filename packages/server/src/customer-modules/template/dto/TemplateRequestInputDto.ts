import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VariableInput {
  @Field()
  name: string;

  @Field()
  value: string;
}

@InputType()
export class ButtonInput {
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
export class TemplateRequestInput {
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

  @Field(() => [ButtonInput], { nullable: true })
  button: ButtonInput[];

  @Field(() => [VariableInput], { nullable: true })
  variables: VariableInput[];
}
