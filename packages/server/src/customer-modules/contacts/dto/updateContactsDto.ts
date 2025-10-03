import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class updateContactsDto {
  @Field()
  id: string;

  @Field()
  contactName: string;

  @Field(() => Float)
  phoneNo: number;

  @Field(() => Boolean, { nullable: true })
  defaultContact?: boolean;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  profileImg?: string;
}
