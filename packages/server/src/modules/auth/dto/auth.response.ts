import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

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
  accessToken : AuthTokenDto;

  @Field()
  workspaceIds: string;

  @Field(() => UserDetails)
  userDetails: UserDetails;
}