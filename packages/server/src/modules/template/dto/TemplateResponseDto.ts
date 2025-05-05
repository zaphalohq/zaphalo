import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TemplateResponseDto {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  data?: string;

  @Field(() => String, { nullable: true })
  error?: string;

//   @Field(() => String, { nullable: true })
//   status?: string;
}


