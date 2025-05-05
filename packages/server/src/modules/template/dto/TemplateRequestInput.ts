import { Field, InputType } from "@nestjs/graphql";

@InputType()
class ExampleInput {
  @Field(() => [[String]], { nullable: true })
  body_text?: string[][];
}

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

  @Field(() => ExampleInput, { nullable: true })
  example?: ExampleInput;
  
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