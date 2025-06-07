import { forwardRef, Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { BroadcastService } from "./broadcast.service";
import { BroadcastResolver } from "./broadcast.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";
import { Broadcast } from "./broadcast.entity";
import { instantsModule } from "../whatsapp/instants.module";
import { MailingListModule } from "../mailingList/mailingList.module";
import { TemplateModule } from "../template/template.module";
import { BroadcastContacts } from "./broadcastContacts.entity";

@Module({
    imports : [ 
      NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Broadcast, BroadcastContacts], 'core'),
            TypeORMModule,
            WorkspaceModule,
            instantsModule,
            MailingListModule,
            TemplateModule
          ],
          services: [BroadcastService],
        }),],
    providers : [BroadcastService, BroadcastResolver],
    exports: [BroadcastService],
})

export class BroadcastModule {}