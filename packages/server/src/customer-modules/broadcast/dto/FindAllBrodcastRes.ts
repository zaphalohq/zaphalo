import { Field, ObjectType } from "@nestjs/graphql";
import { Broadcast } from "../broadcast.entity";

@ObjectType()
export class FindAllBrodcastRes {
  @Field(() => [Broadcast])
  allBroadcast: Broadcast[];

  @Field()
  totalPages: number;

}
