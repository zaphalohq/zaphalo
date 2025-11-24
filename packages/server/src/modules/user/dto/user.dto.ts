import { Field, ObjectType } from '@nestjs/graphql'
import { IsString, IsStrongPassword } from "class-validator";
import { QueryOptions } from '@ptc-org/nestjs-query-graphql'

@ObjectType('User')
@QueryOptions({ enableTotalCount: true })
export class userDTO {
  @Field()
  @IsString()
  username: string

  @Field()
  @IsString()
  email: string

  @Field()
  @IsStrongPassword()
  password: string

  @Field({ nullable : true })
  profileImg?: string;
}