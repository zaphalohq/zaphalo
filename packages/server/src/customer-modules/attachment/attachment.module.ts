import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { Attachment } from "./attachment.entity";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";

@Module({
    imports : [ 
      NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Attachment]),
            TypeORMModule,
          ],
          services: [],
        }),],
    providers : [],
    exports: [],
})

export class AttachmentModule {}