import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class createContactsDto {
  @Field()
  contactName: string;

  @Field()
  phoneNo: String;

  @Field(() => String, { nullable: true })
  profileImg?: string;
}
