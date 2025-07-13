import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";

import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Attachment } from "./attachment.entity";
import { AttachmentService } from "./attachment.service";
import { AttachmentResolver } from "./attachment.resolver";

@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Attachment]),
        TypeORMModule,
      ],
      services: [],
    }),],
    providers: [AttachmentService, AttachmentResolver],
    exports: [AttachmentService],
  })

export class AttachmentModule {}