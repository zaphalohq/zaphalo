import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteBroadcastResponseDto {
  @Field(() => Boolean)
  status: boolean;

  @Field(() => String)
  message: string;
}