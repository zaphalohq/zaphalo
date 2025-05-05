import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";

import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
import { TemplateResolver } from "./template.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";


@Module({
    imports : [ NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Template], 'core'),
            TypeORMModule,
            // ContactsModule,
            // UserModule,
            WorkspaceModule,
            // instantsModule
          ],
          services: [TemplateService],
        //   resolvers: whatappinstanstsAutoResolverOpts,
        }),],
    // controllers : [fileupload,channelController],
    providers : [TemplateService, TemplateResolver],
    exports: [TemplateService ],
})

export class TemplateModule {}