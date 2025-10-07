import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { AddressInput } from './addressInput.dto';

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

  @Field(() => AddressInput, { nullable: true })
  address?: AddressInput;

  @Field(() => String, { nullable: true })
  profileImg?: string;
}
