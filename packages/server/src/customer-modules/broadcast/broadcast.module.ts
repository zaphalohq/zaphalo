import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { BroadcastService } from "src/customer-modules/broadcast/services/broadcast.service";
import { BroadcastResolver } from "src/customer-modules/broadcast/resolvers/broadcast.resolver";
import { Broadcast } from "src/customer-modules/broadcast/entities/broadcast.entity";
import { BroadcastTrace } from "src/customer-modules/broadcast/entities/broadcast-trace.entity";
import { WhatsAppModule } from "src/customer-modules/whatsapp/whatsapp.module";
import { MailingListModule } from "src/customer-modules/mailingList/mailingList.module";
import { BroadcastMessageJob } from "src/customer-modules/broadcast/jobs/broadcast-message.job";
import { BroadcastCreatedListener } from 'src/customer-modules/broadcast/listeners/broadcast-created.listener';
import { BroadcastSendJob } from 'src/customer-modules/broadcast/crons/jobs/broadcast-send-cron.job';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { Workspace } from 'src/modules/workspace/workspace.entity';


@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Broadcast, BroadcastTrace]),
        NestjsQueryTypeOrmModule.forFeature([Workspace], 'core'),
        MailingListModule,
        WorkspaceModule,
      ],
    }),
    WhatsAppModule,
  ],
  providers : [
    BroadcastService,
    BroadcastResolver,
    BroadcastMessageJob,
    BroadcastCreatedListener,
    BroadcastSendJob,
  ],
  exports: [
    BroadcastService,
    BroadcastCreatedListener
  ],
})

export class BroadcastModule {}