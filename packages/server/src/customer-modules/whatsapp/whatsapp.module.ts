import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';


import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WhatsAppMessage } from './entities/whatsapp-message.entity';
import { WhatsAppTemplate } from './entities/whatsapp-template.entity';
import { WhatsAppResolver } from './whatsapp.resolver';
import { WaAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service';
import { MessageService } from './services/whatsapp-message.service';

import { TemplateService } from './services/whatsapp-template.service';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { ContactsModule } from 'src/customer-modules/contacts/contacts.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { WaAccountResolver } from './resolvers/account.resolver';
import { AttachmentModule } from '../attachment/attachment.module';
import { WhatsAppTemplateResolver } from './resolvers/template.resolver';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { MessageQueueModule } from 'src/modules/message-queue/message-queue.module';
import { SendWhatsAppMessageJob } from './jobs/whatsapp-message.job';
import { UpdateTemplateJob } from 'src/customer-modules/whatsapp/crons/jobs/whatsapp-template-sync.job';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        // ScheduleModule.forRoot(),
        NestjsQueryTypeOrmModule.forFeature([WhatsAppAccount, WhatsAppMessage, WhatsAppTemplate]),
        // NestjsQueryTypeOrmModule.forFeature([Workspace], 'core'),
        TypeORMModule,
        ContactsModule,
        WorkspaceModule,
        AttachmentModule,
        FileStorageModule,
        JwtModule,
      ],
      services: [WaAccountService, WhatsAppSDKService, TemplateService, MessageService],
    }),
    HttpModule,
    MessageQueueModule,
  ],
  providers: [
    WaAccountService,
    WhatsAppSDKService,
    TemplateService,
    MessageService,
    WhatsAppResolver,
    WaAccountResolver,
    WhatsAppTemplateResolver,
    SendWhatsAppMessageJob,
    UpdateTemplateJob
  ],
  exports: [WaAccountService, WhatsAppSDKService, TemplateService, MessageService],
})
export class WhatsAppModule {}
