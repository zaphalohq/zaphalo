import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class sendMsgDto {
  @Field()
  to: string;

  @Field()
  msg: string;

}