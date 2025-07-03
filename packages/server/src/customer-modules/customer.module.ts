import { Module } from '@nestjs/common';
import { CatsModule } from 'src/customer-modules/cats/cats.module';
import { ContactsModule } from './contacts/contacts.module';
import { channelModule } from './channel/channel.module';
import { TemplateModule } from './template/template.module';
import { MailingListModule } from './mailingList/mailingList.module';
import { BroadcastModule } from './broadcast/broadcast.module';

@Module({
  imports: [
    CatsModule, 
    ContactsModule,
    channelModule,
    TemplateModule,
    MailingListModule,
    BroadcastModule,
  ],
  exports: [
    CatsModule,
            ContactsModule,
    channelModule,
    TemplateModule,
    MailingListModule,
    BroadcastModule,
  ],
})
export class CustomerModule {}