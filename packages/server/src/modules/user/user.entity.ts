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


@Entity({ name: 'user', schema: 'core' })
@ObjectType('User')
export class User {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: ''})
  @Field()
  firstName: string

  @Column({default: ''})
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