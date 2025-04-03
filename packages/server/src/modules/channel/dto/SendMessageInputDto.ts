import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field(() => Number)
  senderId: number;

  @Field(() => [Number]) // Array of numbers
  receiverId: number[];

  @Field(() => String)
  msg: string;

  @Field(() => String)
  channelName: string;

  @Field(() => String, { nullable: true })
  channelId?: string;
}

// Define the response type
@ObjectType()
export class SendMessageResponse {
  @Field(() => String)
  message: string; // Simple response for now
}