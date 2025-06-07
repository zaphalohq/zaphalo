import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthToken {
  @Field()
  loginToken: string;
}