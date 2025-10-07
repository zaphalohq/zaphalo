import { Field, ObjectType } from "@nestjs/graphql";
import { MailingList } from "../mailingList.entity";

@ObjectType()
export class MailingContactResDto {
  @Field({ nullable: true })
  id?: string;

  @Field()
  contactName: string;

  @Field()
  contactNo: string;

  @Field(() => MailingList, { nullable: true })
  mailingList?: MailingList;

  @Field()
  createdAt: Date;
}