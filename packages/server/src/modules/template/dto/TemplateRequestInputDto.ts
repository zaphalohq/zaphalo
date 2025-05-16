// import { InputType, Field } from '@nestjs/graphql';

// @InputType()
// export class TemplateRequestInput {
//   @Field()
//   name: string;

//   @Field()
//   category: string; 

//   @Field()
//   language: string;

//   @Field({ nullable: true })
//   headerText: string;

//   @Field({ nullable: true })
//   headerFormat: string; // Consider using an enum: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'

//   @Field({ nullable: true })
//   bodyText: string;

//   @Field({ nullable: true })
//   body_text: string;

//   @Field({ nullable: true })
//   footerText: string;

//   @Field({ nullable: true })
//   buttonText: string;

//   @Field({ nullable: true })
//   buttonUrl: string;

//   @Field({ nullable: true })
//   header_handle: string;
// }


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
  buttonText: string;

  @Field()
  buttonUrl: string;
}

@InputType()
export class TemplateRequestInput {
  @Field()
  account: string;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field()
  language: string;

  @Field({ nullable: true })
  headerText: string;

  @Field({ nullable: true })
  headerFormat: string;

  @Field({ nullable: true })
  bodyText: string;

  @Field({ nullable: true })
  body_text: string;

  @Field({ nullable: true })
  footerText: string;

  @Field({ nullable: true })
  header_handle: string;

  @Field(() => [ButtonInput], { nullable: true })
  button: ButtonInput[];

  @Field(() => [VariableInput], { nullable: true })
  variables: VariableInput[];
}
