import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Broadcast } from 'src/customer-modules/broadcast/entities/broadcast.entity';
import { Contacts } from 'src/customer-modules/contacts/contacts.entity';

@ObjectType()
export class DashboardStatsDto {
  @Field(() => Int)
  sentCount: number;

  @Field(() => Int)
  deliveredCount: number;

  @Field(() => Int)
  failedCount: number;

  @Field(() => [Contacts], { nullable: true })
  contacts?: Contacts[] | null;

  @Field(() => [Broadcast], { nullable: true })
  broadcasts?: Broadcast[] | null;
}
