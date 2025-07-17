import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateAttachmentDto {
  @Field()
  name: string;

  @Field()
  originalname: string;

  @Field()
  mimetype: string;

  @Field()
  size: number;

  @Field()
  path: string;

  @Field()
  createdAt: Date;

	@Field()
  updatedAt: Date;
}
