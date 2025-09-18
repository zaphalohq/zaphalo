import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { BroadcastService } from "./broadcast.service";
import { BroadcastResolver } from "./broadcast.resolver";
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { WhatsAppModule } from "src/customer-modules/whatsapp/whatsapp.module";
import { MailingListModule } from "src/customer-modules/mailingList/mailingList.module";
import { BroadcastMessageJob } from "src/customer-modules/broadcast/jobs/broadcast-message.job";
import { BroadcastCreatedListener } from 'src/customer-modules/broadcast/listeners/broadcast-created.listener';

@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Broadcast, BroadcastContacts]),
        MailingListModule,
      ],
    }),
    WhatsAppModule,
  ],
  providers : [
    BroadcastService,
    BroadcastResolver,
    BroadcastMessageJob,
    BroadcastCreatedListener
  ],
  exports: [
    BroadcastService,
    BroadcastCreatedListener
  ],
})

export class BroadcastModule {}