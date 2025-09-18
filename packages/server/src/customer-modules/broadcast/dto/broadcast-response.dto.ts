import { Field, ObjectType } from "@nestjs/graphql";
import { Broadcast } from "../broadcast.entity";

@ObjectType()
export class BroadcastResponse {
  @Field(() => Broadcast, { nullable: true })
  broadcast: Broadcast;

  @Field()
  status: boolean;

  @Field()
  message: string;
}
