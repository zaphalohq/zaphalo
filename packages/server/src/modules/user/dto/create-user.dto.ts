import { InputType, ObjectType, Field, ID } from '@nestjs/graphql';  // GraphQL decorators
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsString, IsEmail, IsStrongPassword, IsOptional } from 'class-validator';  // Optional: for validation

@InputType()
@ObjectType()  // Marks the class as a GraphQL object (type that can be queried)
export class CreateUserDTO {

  @Field()  // Marks this field as a GraphQL field
  @IsString()  // Optional: validates if the name is a string
  username: string;

  @Field()  // Marks this field as a GraphQL field
  // @IsEmail()  // Optional: validates if the email is in the correct format
  email: string;

  @Field()
  // @IsStrongPassword()
  password: string;

    @Field()  // Marks this field as a GraphQL field
  // @IsEmail()  // Optional: validates if the email is in the correct format
  fullName: string;


  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  inviteToken?: string;
}
