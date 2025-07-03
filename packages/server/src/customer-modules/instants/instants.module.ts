import { Module } from '@nestjs/common';
import { instantsService,  } from './instants.service';
import { instantsResolver } from './instants.resolver';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { WhatsappInstants } from './Instants.entity';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { whatappinstanstsAutoResolverOpts } from './instants.auto-resolver-opts';
import { ContactsModule } from '../contacts/contacts.module';
import { Template } from '../template/template.entity';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([WhatsappInstants, Template]),
        TypeORMModule,
        // TypeOrmModule.forFeature([WhatsappInstants]),
        WorkspaceModule,
        ContactsModule,
      ],
      services: [instantsService],
      resolvers: whatappinstanstsAutoResolverOpts,
    }),],
  providers: [instantsService, instantsResolver, TypeORMModule],
  exports: [instantsService],
})
export class instantsModule {}
