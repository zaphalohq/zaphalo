import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class WaTemplateResponseDto {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  data?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}