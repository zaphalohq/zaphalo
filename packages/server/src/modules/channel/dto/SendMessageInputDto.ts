import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field(() => Number, { nullable: true })
  senderId?: number;

  @Field(() => [Number]) // Array of numbers
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

// Define the response type
@ObjectType()
export class SendMessageResponse {
  @Field(() => String)
  message: string; // Simple response for now
}