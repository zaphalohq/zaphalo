import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class SearchedRes {
  @Field(() => GraphQLJSON)
  searchedData: any[];

  @Field()
  totalCount: number;
}