import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { BroadcastService } from "./broadcast.service";
import { BroadcastResolver } from "./broadcast.resolver";
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { WorkspaceModule } from "src/modules/workspace/workspace.module";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { WhatsAppModule } from "src/customer-modules/whatsapp/whatsapp.module";
import { MailingListModule } from "src/customer-modules/mailingList/mailingList.module";

@Module({
    imports : [ 
      NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Broadcast, BroadcastContacts]),
            TypeORMModule,
            WorkspaceModule,
            MailingListModule,
            WhatsAppModule
          ],
          services: [BroadcastService],
        }),],
    providers : [BroadcastService, BroadcastResolver],
    exports: [BroadcastService],
})

export class BroadcastModule {}