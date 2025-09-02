import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/role.enum';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';

@Entity({ name: 'user', schema: 'core' })
@ObjectType('user')
export class User {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Field()
  firstName: string

  @Column({ nullable: true })
  @Field()
  lastName: string

  @Column()
  @Field()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

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