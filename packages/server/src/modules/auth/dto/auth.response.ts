import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  workspaceIds: string;

  @Field(() => UserDetails)
  userDetails: UserDetails;
}