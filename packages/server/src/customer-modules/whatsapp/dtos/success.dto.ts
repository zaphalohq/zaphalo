import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SuccessResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  error?: string;
}
