import { Field, ObjectType } from "@nestjs/graphql";
import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { Message } from "src/customer-modules/channel/entities/message.entity";

@ObjectType()
export class MessageEdge {
  @Field(() => [Message])
  edges: Message[];

  @Field()
  hasMore: boolean;

  @Field({ nullable: true })
  cursor?: string;
}