import { Field, ObjectType } from '@nestjs/graphql';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Relation,
} from 'typeorm';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/role.enum';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';

// import { AppToken } from 'src/constro/modules/app-token/app-token.entity';
// import { WorkspaceMember } from 'src/constro/modules/user/dtos/workspace-member.dto';
// import { UserWorkspace } from 'src/constro/modules/user-workspace/user-workspace.entity';
// import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';


@Entity({ name: 'user', schema: 'core' })
@ObjectType('User')
export class User {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()                                // Regular database column
  @Field()                                 // GraphQL field
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string ;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  inviteToken?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Field(() => [WorkspaceMember])
  @OneToMany(() => WorkspaceMember, (userWorkspace) => userWorkspace.user)
  workspaces: Relation<WorkspaceMember[]>;

  @Field(() => Workspace, { nullable: true })
  currentWorkspace: Relation<Workspace>;

  @Field(() => WorkspaceMember, { nullable: true })
  currentUserWorkspace?: Relation<WorkspaceMember>;
}