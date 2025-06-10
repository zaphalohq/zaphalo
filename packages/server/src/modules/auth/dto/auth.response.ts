import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
export class AuthTokenDto {
  @Field()
  token: string;

  @Field()
  expiresAt: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  accessToken : AuthTokenDto;

  @Field()
  workspaceIds: string;

  @Field(() => UserDetails)
  userDetails: UserDetails;
}