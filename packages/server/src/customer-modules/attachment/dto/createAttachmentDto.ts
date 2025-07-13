import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateAttachmentDto {
  @Field()
  name: string;

  @Field()
  originalname: string;

  @Field()
  type: string;

  @Field()
  size: number;

  @Field()
  fullPath: string;

  @Field()
  createdAt: Date;

	@Field()
  updatedAt: Date;
}
