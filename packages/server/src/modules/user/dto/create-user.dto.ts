import { InputType, ObjectType, Field, ID } from '@nestjs/graphql';  // GraphQL decorators
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsString, IsEmail, IsStrongPassword, IsOptional } from 'class-validator';  // Optional: for validation

@InputType()
@ObjectType()  // Marks the class as a GraphQL object (type that can be queried)
export class CreateUserDTO {

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field() 
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  workspaceId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  workspaceInviteToken?: string;
}
