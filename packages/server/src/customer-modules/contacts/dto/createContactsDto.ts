import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class createContactsDto {
  @Field()
  contactName: string;

  @Field(() => Float)
  phoneNo: number;

  @Field(() => Boolean, { nullable: true })
  defaultContact?: boolean;

  @Field(() => String, { nullable: true })
  profileImg?: string;
}
