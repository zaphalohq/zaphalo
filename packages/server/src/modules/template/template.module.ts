import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";

import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
import { TemplateResolver } from "./template.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";
import { TemplateFileUpload } from "./templateFileUpload.controller";
import { instantsModule } from "../whatsapp/instants.module";
import { TypeORMModule } from "../../database/typeorm/typeorm.module";
import { MailingListModule } from "../mailingList/mailingList.module";


@Module({
    imports : [ NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Template], 'core'),
            TypeORMModule,
            // ContactsModule,
            // UserModule,
            WorkspaceModule,
            instantsModule,
            MailingListModule,
          ],
          services: [TemplateService,],
        //   resolvers: whatappinstanstsAutoResolverOpts,
        }),],
    controllers : [TemplateFileUpload],
    providers : [TemplateService, TemplateResolver],
    exports: [TemplateService ],
})

export class TemplateModule {}