import { Field, ObjectType } from "@nestjs/graphql";
import { MailingList } from "src/customer-modules/mailingList/mailingList.entity";

@ObjectType('ContactListResponse')
export class ContactListResponse {
  @Field(() => MailingList, { nullable: true })
  contactList?: MailingList | null;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  status: boolean;
}