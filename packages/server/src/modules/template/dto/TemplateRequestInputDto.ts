import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TemplateRequestInput {
  @Field()
  name: string;

  @Field()
  category: string; // You could use an enum if values are limited to 'UTILITY', etc.

  @Field()
  language: string;

  @Field({ nullable: true })
  headerText: string;

  @Field({ nullable: true })
  headerFormat: string; // Consider using an enum: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'

  @Field({ nullable: true })
  bodyText: string;

  @Field({ nullable: true })
  body_text: string;

  @Field({ nullable: true })
  footerText: string;

  @Field({ nullable: true })
  buttonText: string;

  @Field({ nullable: true })
  buttonUrl: string;

  @Field({ nullable: true })
  header_handle: string;
}
