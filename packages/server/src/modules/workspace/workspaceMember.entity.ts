import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { User } from "../user/user.entity";
import { Workspace } from "./workspace.entity";
import { Role } from '../../enums/role.enum';

// WorkspaceMember Entity
@Entity({ name: 'workspace_member', schema: 'core' })
@ObjectType('WorkspaceMember')
export class WorkspaceMember {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>

  @Field({ nullable: false })
  @Column()
  userId: string;
  
  @Field(() => Workspace, { nullable: true })
  @ManyToOne(() => Workspace, (workspace) => workspace.members, { nullable: true })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Relation<Workspace>;


  @Field({ nullable: true })
  @Column()
  workspaceId: string;

  @Field(() => String)
  @CreateDateColumn()
  joinedAt: Date;

  @Field(() => String)
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
