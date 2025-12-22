import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.services';
import { WaMessageService } from '../whatsapp/services/whatsapp-message.service';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { ContactsService } from '../contacts/contacts.service';
import { ContactsModule } from '../contacts/contacts.module';
import { BroadcastModule } from '../broadcast/broadcast.module';
import { BroadcastService } from '../broadcast/services/broadcast.service';
import { MailingListModule } from '../mailingList/mailingList.module';

@Module({
  imports: [
    WhatsAppModule,
    ContactsModule,
    BroadcastModule,
    MailingListModule
  ],
  providers: [
    DashboardResolver,
    DashboardService,
  ]
})
export class DashboardModule {}
