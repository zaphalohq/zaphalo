import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { User } from "../user/user.entity";
import { Workspace } from "./workspace.entity";
import { Role } from 'src/enums/role.enum';

// WorkspaceMember Entity
@Entity({ name: 'workspace_member', schema: 'core' })
@ObjectType('WorkspaceMember')
export class WorkspaceMember {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  user: Relation<User>

  // @Field(() => [Workspace])
  // @ManyToMany(() => Workspace, (workspace) => workspace.members, {
  //   nullable: false,
  // })
  // @JoinTable({
  //   name: 'workspace_member_workspace',
  //   joinColumn: { name: 'workspaceMemberId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'workspaceId', referencedColumnName: 'id' },
  // })
  // workspace: Relation<Workspace[]>;
  
  @Field(() => Workspace, { nullable: true })
  @ManyToOne(() => Workspace, (workspace) => workspace.members, { nullable: true })
  workspace: Relation<Workspace>;

  @Field(() => String)
  @CreateDateColumn()
  joinedAt: Date;

  @Field(() => String)
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
