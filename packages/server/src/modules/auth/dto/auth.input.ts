import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable : true })
  inviteToken?: string;
}