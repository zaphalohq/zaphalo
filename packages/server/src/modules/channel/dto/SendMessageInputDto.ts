import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field(() => Number, { nullable: true })
  senderId?: number;

  @Field(() => [Number])
  receiverId: number[];

  @Field(() => String)
  textMessage: string;

  @Field(() => String)
  channelName: string;

  @Field(() => String, { nullable: true })
  channelId?: string;

  @Field(() => String, { nullable : true})
  attachmentUrl: string;
}

@ObjectType()
export class SendMessageResponse {
  @Field(() => String)
  success: string;
}