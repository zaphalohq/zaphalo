import { Field, ObjectType } from "@nestjs/graphql";
import { MailingList } from "../mailingList.entity";

@ObjectType()
export class FindAllMailingListRes {
  @Field(() => [MailingList])
  mailingList: MailingList[];

  @Field()
  total: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;

}
