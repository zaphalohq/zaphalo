import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class AuthProviders {

	@Field()
  google: boolean;
  
}

@ObjectType()
export class SystemConfig {

	@Field()
  authProviders: AuthProviders;
}