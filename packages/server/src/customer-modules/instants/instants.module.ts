import { Module } from '@nestjs/common';
import { instantsService,  } from './instants.service';
import { instantsResolver } from './instants.resolver';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { WhatsappInstants } from './Instants.entity';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { whatappinstanstsAutoResolverOpts } from './instants.auto-resolver-opts';
import { ContactsModule } from 'src/customer-modules/contacts/contacts.module';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([WhatsappInstants, WhatsAppTemplate]),
        TypeORMModule,
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
