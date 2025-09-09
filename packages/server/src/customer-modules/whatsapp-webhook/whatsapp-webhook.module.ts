import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";

import { WhatsAppWebhookController } from 'src/customer-modules/whatsapp-webhook/controllers/whatsapp-webhook.controller';
import { WhatsAppWebhookService } from 'src/customer-modules/whatsapp-webhook/whatsapp-webhook.service'
import { ContactsModule } from 'src/customer-modules/contacts/contacts.module';
import { ChannelModule } from 'src/customer-modules/channel/channel.module';
import { WhatsAppModule } from 'src/customer-modules/whatsapp/whatsapp.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { AttachmentModule } from 'src/customer-modules/attachment/attachment.module';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        // NestjsQueryTypeOrmModule.forFeature([User], 'core'),
      ],
    }),
    ContactsModule,
    ChannelModule,
    WhatsAppModule,
    WorkspaceModule,
    AttachmentModule,
    FileStorageModule,
    JwtModule,
  ],
  providers: [WhatsAppWebhookService],
  controllers: [WhatsAppWebhookController],
  exports: [WhatsAppWebhookService]
})

export class WhatsAppWebhookModule { }