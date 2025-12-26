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
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppMessage } from 'src/customer-modules/whatsapp/entities/whatsapp-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsAppMessage]),
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
