import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { User } from '../user/user.entity';
import { WorkspaceMember } from './workspaceMember.entity';
import { AppToken } from 'src/modules/app-token/app-token.entity';


@Entity({ name: 'workspace', schema: 'core' })
@ObjectType('Workspace')
export class Workspace {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inviteToken?: string;

  // Relations
  @Field(() => [AppToken], { nullable: true })
  @OneToMany(() => AppToken, (appToken) => appToken.workspace, {
    cascade: true, nullable: true
  })
  appTokens: Relation<AppToken[]>;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: true })
  owner: Relation<User>;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Boolean)
  @Column({ nullable: true, default : false})
  isWorkspaceSetup: boolean;

  @Field(() => String)
  @Column({nullable: true})
  profileImg: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [WorkspaceMember], { nullable: true })
  @OneToMany(() => WorkspaceMember, (member) => member.workspace, { nullable: true })
  members: Relation<WorkspaceMember[]>;
}
