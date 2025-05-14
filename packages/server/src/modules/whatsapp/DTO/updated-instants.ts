import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdatedInstantsDTO {
  
    @Field()
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
