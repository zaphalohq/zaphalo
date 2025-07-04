import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { User } from "./user.entity";
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { userAutoResolverOpts } from './user.auto-resolver-opts';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([User], 'core'),
        TypeORMModule
      ],
      services: [UserService],
      resolvers: userAutoResolverOpts,
    }),
  ],
  exports: [UserService],
  providers: [UserService, UserResolver, TypeORMModule],
})

export class UserModule {}