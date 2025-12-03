import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { User } from "../user/user.entity";
import { Workspace } from "./workspace.entity";
import { Role } from '../../enums/role.enum';
// import { UserStatus } from 'src/enums/role.enum';

@Entity({ name: 'workspace_member', schema: 'core' })
@ObjectType('WorkspaceMember')
export class WorkspaceMember {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.workspaceMembers, { nullable: false })
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
  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @Field(() => Boolean)
  @Column({ default: true })
  active: Boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

}
