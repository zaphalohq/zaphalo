import { Field, ObjectType } from "@nestjs/graphql";
import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { Message } from "src/customer-modules/channel/entities/message.entity";

@ObjectType()
export class ManyChannelMessageResponse {
  @Field(() => Channel)
  channel: Channel;

  @Field(() => [Message])
  messages: Message;

  @Field()
  total: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}
