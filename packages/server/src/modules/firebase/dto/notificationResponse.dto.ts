import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SendNotificationResponse {
  @Field(() => Int)
  successCount: number;

  @Field(() => Int)
  failureCount: number;
}
