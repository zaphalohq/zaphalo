import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class BroadcastReqDto {
  @Field()
  accountId: string;

  @Field()
  broadcastName: string;

  @Field()
  templateId: string;

  @Field()
  mailingListId: string;

}
