import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { Workspace } from "./workspace.entity";
import { User } from "../user/user.entity";

@Entity({ name: 'workspace_invitation', schema: 'core' })
@ObjectType('WorkspaceInvitation')
export class WorkspaceInvitation {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Field(() => Workspace)
  @ManyToOne(() => Workspace, { nullable: false })
  workspace: Relation<Workspace>;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  invitedBy: Relation<User>;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ type: 'boolean', default: false })
  isUsed: boolean;
}