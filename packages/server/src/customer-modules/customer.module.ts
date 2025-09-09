import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { ChannelModule } from './channel/channel.module';
import { MailingListModule } from './mailingList/mailingList.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { WhatsAppWebhookModule } from './whatsapp-webhook/whatsapp-webhook.module';
import { AttachmentModule } from 'src/customer-modules/attachment/attachment.module';

@Module({
  imports: [
    ContactsModule,
    ChannelModule,
    MailingListModule,
    // BroadcastModule,
    WhatsAppModule,
    AttachmentModule,
    WhatsAppWebhookModule,
  ],
  exports: [
    ContactsModule,
    ChannelModule,
    MailingListModule,
    // BroadcastModule,
    WhatsAppModule,
    AttachmentModule,
    WhatsAppWebhookModule,
  ],
})
export class CustomerModule { }