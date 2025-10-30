import { Field, ObjectType } from "@nestjs/graphql";
import { Broadcast } from 'src/customer-modules/broadcast/entities/broadcast.entity';


@ObjectType()
export class ManyBrodcastsResponse {
  @Field(() => [Broadcast])
  broadcasts: Broadcast[];

  @Field()
  total: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}
