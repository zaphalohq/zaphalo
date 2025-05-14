import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field(() => Number)
  senderId: number;

  @Field(() => [Number])
  receiverId: number[];

  @Field(() => String)
  message: string;

  @Field(() => String)
  channelName: string;

  @Field(() => String, { nullable: true })
  channelId?: string;

  @Field(() => String, { nullable : true})
  attachment: string;
}

@ObjectType()
export class SendMessageResponse {
  @Field(() => String)
  message: string;
}