import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtAuthStrategy } from './strategies/jwt.auth.strategy';
import { User } from 'src/modules/user/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { EmailModule } from "src/modules/email/email.module";
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { Workspace } from "src/modules/workspace/workspace.entity";
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { userAutoResolverOpts } from 'src/modules/user/user.auto-resolver-opts';
import { AuthSsoService } from 'src/modules/auth/services/auth-sso.service';
import { SignInUpService } from 'src/modules/auth/services/sign-in-up.service';
import { WorkspaceMember } from "src/modules/workspace/workspaceMember.entity";
import { DomainManagerModule } from 'src/modules/domain-manager/domain-manager.module';
import { WorkspaceMemberService } from "src/modules/workspace/workspaceMember.service";
import { WorkspaceInvitation } from "src/modules/workspace/workspaceInvitation.entity";
import { GoogleAuthController } from 'src/modules/auth/controllers/google.auth.controller';
import { TokenModule } from 'src/modules/auth/token/token.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';
import { FcmTokenModule } from '../fcm-token/fcm-token.module';

@Module({
  imports: [
    JwtModule,
    DomainManagerModule,
    TokenModule,
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
        FcmTokenModule,
        NestJwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '7d' },
        }),
      ],
      services: [UserService],
      resolvers: userAutoResolverOpts,
    }),
  ],
  controllers: [
    GoogleAuthController,
  ],
  providers: [
    AuthService,
    UserService,
    AuthResolver,
    JwtAuthStrategy,
    AuthSsoService,
    SignInUpService,
    WorkspaceMemberService,
  ],
  exports: [AuthService],
})
export class AuthModule { }
