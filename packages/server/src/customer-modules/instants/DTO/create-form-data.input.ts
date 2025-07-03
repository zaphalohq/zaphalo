import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFormDataInput {
  @Field()
  name: string;

  @Field()
  appId: string;

  @Field()
  phoneNumberId: string;

  @Field()
  businessAccountId: string;

  @Field()
  accessToken: string;

  @Field()
  appSecret: string;
}


