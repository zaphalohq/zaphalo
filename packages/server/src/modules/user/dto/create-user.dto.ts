import { IsString, IsOptional } from 'class-validator';
import { InputType, ObjectType, Field } from '@nestjs/graphql';

@InputType()
@ObjectType()
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

  @Field({ nullable : true })
  profileImg?: string;
}
