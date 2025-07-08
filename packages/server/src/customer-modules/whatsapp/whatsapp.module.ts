import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { HttpModule } from '@nestjs/axios';

// import { WhatsAppAccountEntity } from './whatsapp-account.entity';
import { WhatsAppResolver } from './whatsapp.resolver';

import { WhatsAppAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
// import { instantsResolver } from './instants.resolver';
// import { whatappinstanstsAutoResolverOpts } from './instants.auto-resolver-opts';
// import { ContactsModule } from 'src/customer-modules/contacts/contacts.module';
// import { Template } from 'src/customer-modules/template/template.entity';
// import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
// import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { instantsModule } from 'src/customer-modules/instants/instants.module';
import { WhatsAppController } from 'src/customer-modules/whatsapp/controllers/whatsapp.controller';


@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([]),
        TypeORMModule,
        instantsModule,
        // ContactsModule,
      ],
      services: [WhatsAppAccountService, WhatsAppSDKService],
      // resolvers: whatappinstanstsAutoResolverOpts,
    }),
    // instantsModule,
    HttpModule,
    // instantsModule,
  ],
  controllers : [WhatsAppController],
  providers: [WhatsAppAccountService, WhatsAppSDKService, WhatsAppResolver],
  exports: [WhatsAppAccountService, WhatsAppSDKService],
})
export class WhatsAppModule {}
