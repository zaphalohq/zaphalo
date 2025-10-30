import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';
``

@InputType()
export class createContactsDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Contact name is required' })
  @Length(1, 100, { message: 'Contact name must be between 1 and 100 characters' })
  contactName: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[1-9][0-9]{9,14}$/, {
    message: 'Phone number must be 10-15 digits and cannot start with 0'
  })
  @MinLength(10, { message: 'Phone number must be at least 10 digits' })
  phoneNo: string;

  @Field(() => String, { nullable: true })
  profileImg?: string;

  @Field(() => String, { nullable: true })
  street?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zipcode?: string;
}
