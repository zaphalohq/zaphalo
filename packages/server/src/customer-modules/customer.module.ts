import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { channelModule } from './channel/channel.module';
// import { TemplateModule } from './template/template.module';
import { MailingListModule } from './mailingList/mailingList.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { AttachmentModule } from 'src/customer-modules/attachment/attachment.module';

@Module({
  imports: [
    ContactsModule,
    channelModule,
    // TemplateModule,
    MailingListModule,
    BroadcastModule,
    WhatsAppModule,
    AttachmentModule,
  ],
  exports: [
    ContactsModule,
    channelModule,
    // TemplateModule,
    MailingListModule,
    BroadcastModule,
    WhatsAppModule,
    AttachmentModule
  ],
})
export class CustomerModule { }