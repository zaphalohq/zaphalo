import { Field, InputType } from "@nestjs/graphql";
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"

@InputType()
export class BroadcastRequest {
  @Field({ nullable: true })
  broadcastId: string;

  @Field()
  whatsappAccountId: string;

  @Field()
  broadcastName: string;

  @Field()
  templateId: string;

  @Field()
  contactListId: string;

  @Field(() => Number, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  intervalType?: string;

  @Field({ nullable: true })
  scheduledAt?: Date
}
