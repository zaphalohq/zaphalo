import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class EngagementGraphDataDto {
  @Field()
  date: string;

  @Field(() => Int)
  sentCount: number;

  @Field(() => Int)
  deliveredCount: number;
}