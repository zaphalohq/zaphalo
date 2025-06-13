import { ObjectType, Field } from '@nestjs/graphql';
import { WorkspaceMember } from '../../workspace/workspaceMember.entity';
import { OneToMany, Relation } from 'typeorm';
import { Workspace } from '../../workspace/workspace.entity';

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


  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;


  @Field(() => [WorkspaceMember])
  @OneToMany(() => WorkspaceMember, (userWorkspace) => userWorkspace.user)
  workspaces: Relation<WorkspaceMember[]>;

  @Field(() => Workspace, { nullable: true })
  currentWorkspace: Relation<Workspace>;

  @Field(() => WorkspaceMember, { nullable: true })
  currentUserWorkspace?: Relation<WorkspaceMember>;
}