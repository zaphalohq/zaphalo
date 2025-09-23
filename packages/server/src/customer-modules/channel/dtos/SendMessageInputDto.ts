import { Field, InputType, ObjectType } from '@nestjs/graphql';

// @InputType()
// export class UploadedFileInput {
//   @Field(() => String)
//   fileUrl: string;

//   @Field(() => String)
//   fileType: string;

//   @Field(() => String)
//   fileName: string;
// }

@InputType()
export class Attachments {
  @Field(() => String)
  attachmentId: string;

  @Field(() => String)
  messageType: string;
  
}

@InputType()
export class SendMessageInput {
  @Field(() => [Number])
  receiverId: number[];

  @Field(() => String)
  textMessage: string;

  @Field(() => String)
  channelName: string;

  @Field(() => String, { nullable: true })
  channelId?: string;

  @Field(() => [Attachments], { nullable: true })
  attachments?: Attachments[];

  // @Field(() => [UploadedFileInput], { nullable: true })
  // uploadedFiles?: UploadedFileInput[];
}

@ObjectType()
export class SendMessageResponse {
  @Field(() => String)
  success: string;
}
