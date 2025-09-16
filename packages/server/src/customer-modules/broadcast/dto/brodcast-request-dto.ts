import { Field, InputType } from "@nestjs/graphql";
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"

@InputType()
export class BroadcastRequest {
  @Field({ nullable: true })
  broadcastId: string;

  @Field()
  accountId: string;

  @Field()
  broadcastName: string;

  @Field()
  templateId: string;

  @Field()
  mailingListId: string;

  @Field(() => broadcastStates, { nullable: true })
  state?: broadcastStates;

}
