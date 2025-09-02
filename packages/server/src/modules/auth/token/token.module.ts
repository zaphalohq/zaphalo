import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessTokenService } from 'src/modules/auth/token/services/access.token.service';
import { JwtModule } from 'src/modules/jwt/jwt.module';
// import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { JwtAuthStrategy } from 'src/modules/auth/strategies/jwt.auth.strategy';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from "src/modules/workspace/workspace.entity";

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature(
      [User, Workspace],
      'core',
    ),
    // TypeORMModule,
    // DataSourceModule,
  ],
  providers: [
    // RenewTokenService,
    // JwtAuthStrategy,
    JwtAuthStrategy,
    AccessTokenService,
    // LoginTokenService,
    // RefreshTokenService,
    // WorkspaceAgnosticTokenService,
  ],
  exports: [
    // RenewTokenService,
    AccessTokenService,
    // LoginTokenService,
    // RefreshTokenService,
    // WorkspaceAgnosticTokenService,
  ],
})
export class TokenModule {}