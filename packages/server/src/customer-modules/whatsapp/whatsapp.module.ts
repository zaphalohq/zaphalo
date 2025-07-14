import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { HttpModule } from '@nestjs/axios';

import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WhatsAppMessage } from './entities/whatsapp-message.entity';
import { WhatsAppTemplate } from './entities/whatsapp-template.entity';
import { WhatsAppResolver } from './whatsapp.resolver';
import { WaAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service';
import { TemplateService } from './services/whatsapp-template.service';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { ContactsModule } from 'src/customer-modules/contacts/contacts.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { WaAccountResolver } from './resolvers/account.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([WhatsAppAccount, WhatsAppMessage, WhatsAppTemplate]),
        TypeORMModule,
        ContactsModule,
        WorkspaceModule
      ],
      services: [WaAccountService, WhatsAppSDKService, TemplateService],
    }),
    HttpModule,
  ],
  providers: [
    WaAccountService,
    WhatsAppSDKService,
    TemplateService,
    WhatsAppResolver,
    WaAccountResolver,
  ],
  exports: [WaAccountService, WhatsAppSDKService, TemplateService],
})
export class WhatsAppModule {}
