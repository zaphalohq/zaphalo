import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.auth.strategy';

import { WorkspaceModule } from '../workspace/workspace.module';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { UserService } from '../user/user.service';
import { userAutoResolverOpts } from '../user/user.auto-resolver-opts';
import { GoogleAuthController } from 'src/modules/auth/controllers/google.auth.controller';
import { DomainManagerModule } from 'src/modules/domain-manager/domain-manager.module';
import { AuthSsoService } from 'src/modules/auth/services/auth-sso.service';
import { SignInUpService } from 'src/modules/auth/services/sign-in-up.service';
import { Workspace } from "../workspace/workspace.entity";
import { WorkspaceInvitation } from "../workspace/workspaceInvitation.entity";
import { WorkspaceMember } from "../workspace/workspaceMember.entity";
import { WorkspaceMemberService } from "src/modules/workspace/workspaceMember.service";
import { EmailModule } from "src/modules/email/email.module";


@Module({
  imports: [
    DomainManagerModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          User,
          Workspace,
          WorkspaceMember,
          WorkspaceInvitation,
        ], 'core'),
        TypeORMModule,
        UserModule,
        WorkspaceModule,
        PassportModule,
        EmailModule,
        JwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '7d' },
        }),
      ],
      services: [UserService],
      resolvers: userAutoResolverOpts,
    }),
    // UserModule,
    // TypeOrmModule.forFeature(
    //   [
    //     User,
    //   ],
    //   'core',
    // ),
  ],
  controllers: [
    GoogleAuthController,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GoogleStrategy,
    AuthSsoService,
    SignInUpService,
    WorkspaceMemberService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
