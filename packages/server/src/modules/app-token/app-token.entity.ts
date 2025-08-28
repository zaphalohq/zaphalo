import { Field, ObjectType } from '@nestjs/graphql';

import { BeforeCreateOne, IDField } from '@ptc-org/nestjs-query-graphql';
import { isDefined } from 'src/utils/isDefined';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar';
import { BeforeCreateOneAppToken } from 'src/modules/app-token/hooks/before-create-one-app-token.hook';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';

export enum AppTokenType {
  RefreshToken = 'REFRESH_TOKEN',
  CodeChallenge = 'CODE_CHALLENGE',
  AuthorizationCode = 'AUTHORIZATION_CODE',
  PasswordResetToken = 'PASSWORD_RESET_TOKEN',
  InvitationToken = 'INVITATION_TOKEN',
  EmailVerificationToken = 'EMAIL_VERIFICATION_TOKEN',
}

@Entity({ name: 'appToken', schema: 'core' })
@ObjectType()
export class AppToken {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.appTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.appTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Relation<Workspace>;

  @Column({ nullable: true })
  workspaceId: string;

  @Field()
  @Column({ nullable: false, type: 'text', default: AppTokenType.RefreshToken })
  type: AppTokenType;

  @Column({ nullable: true, type: 'text' })
  value: string;

  @Field()
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  revokedAt: Date | null;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  formatEmail?() {
    if (isDefined(this.context?.email)) {
      this.context.email = this.context.email.toLowerCase();
    }
  }

  @Column({ nullable: true, type: 'jsonb' })
  context: { email: string } | null;
}
