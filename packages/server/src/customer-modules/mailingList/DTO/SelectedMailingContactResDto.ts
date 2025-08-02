import { Field, ObjectType } from "@nestjs/graphql";
import { MailingContacts } from "../mailingContacts.entity";

@ObjectType()
export class SelectedMailingContactResDto {
  @Field(() => [MailingContacts])
  mailingContact: MailingContacts[];

  @Field()
  totalPages: number;
}


@ObjectType()
export class SearchAndPaginateContactResDto {
  @Field(() => [MailingContacts])
  mailingContact: MailingContacts[];

  @Field()
  totalCount: number;
}