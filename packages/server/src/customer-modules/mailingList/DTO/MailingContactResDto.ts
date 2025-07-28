import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MailingContactResDto {
  @Field({ nullable : true })
  id?: string;
  
  @Field()
  contactName: string;

  @Field()
  contactNo: string;
}