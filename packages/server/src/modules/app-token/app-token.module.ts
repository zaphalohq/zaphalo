import { Module } from '@nestjs/common';

import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { AppToken } from 'src/modules/app-token/app-token.entity';
import { appTokenAutoResolverOpts } from 'src/modules/app-token/app-token.auto-resolver-opts';
import { AppTokenService } from 'src/modules/app-token/services/app-token.service';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([AppToken], 'core')],
      // services: [AppTokenService],
      // resolvers: appTokenAutoResolverOpts,
    }),
  ],
})
export class AppTokenModule {}
