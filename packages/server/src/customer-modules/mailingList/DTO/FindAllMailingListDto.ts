import { Field, ObjectType } from "@nestjs/graphql";
import { MailingList } from "../mailingList.entity";

@ObjectType()
export class FindAllMailingListRes {
  @Field(() => [MailingList])
  mailingList: MailingList[];

  @Field()
  totalPages: number;

}
