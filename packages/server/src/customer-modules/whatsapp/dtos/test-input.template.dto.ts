import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class WaTestTemplateInput {
  @Field()
  dbTemplateId: string;

  @Field()
  testPhoneNo: string;

  @Field()
  templateName: string;

}

@ObjectType()
export class TestTemplateOutput {
  @Field()
  success: string;
}
