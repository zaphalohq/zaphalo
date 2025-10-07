import { Field, ObjectType } from "@nestjs/graphql";
import { MailingContacts } from "../mailingContacts.entity";

@ObjectType()
export class SelectedMailingContactResDto {
  @Field(() => [MailingContacts])
  MailingContacts: MailingContacts[];

  @Field()
  totalPages: number;

  @Field()
  total: number;

  @Field()
  currentPage: number;
}


