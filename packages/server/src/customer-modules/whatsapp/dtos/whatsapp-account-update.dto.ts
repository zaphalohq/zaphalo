import { InputType, Field } from '@nestjs/graphql';


@InputType()
export class WaAccountUpdateDTO {
  @Field(() => [String], { nullable: true })
  id: string;

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
