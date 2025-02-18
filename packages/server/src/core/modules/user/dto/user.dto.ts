import { GraphQLISODateTime, Field, ID, ObjectType } from '@nestjs/graphql'
import { IsString, IsStrongPassword, isStrongPassword } from "class-validator";
import { FilterableField, FilterableRelation, KeySet, QueryOptions } from '@ptc-org/nestjs-query-graphql'


@ObjectType('User')
@KeySet(['id'])
@QueryOptions({ enableTotalCount: true })
export class userDTO {

  @FilterableField(() => ID)
  id!: number

  @Field()
  @IsString()
  username : string

  @Field()
  @IsString()
  email : string

  @Field()
  @IsStrongPassword()
  password : string
}