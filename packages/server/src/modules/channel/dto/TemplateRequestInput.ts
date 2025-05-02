import { Field, InputType } from "@nestjs/graphql";

@InputType()
class TemplateComponentInput {
  @Field()
  type: string;

  @Field({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  format?: string;

  @Field(() => [ButtonInput], { nullable: true })
  buttons?: ButtonInput[];
}

@InputType()
class ButtonInput {
  @Field()
  type: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class TemplateRequestInput {
  @Field()
  name: string;

  @Field()
  category: string;

  @Field()
  language: string;

  @Field(() => [TemplateComponentInput])
  components: TemplateComponentInput[];
}