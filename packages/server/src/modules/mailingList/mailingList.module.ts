import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { MailingList } from "./mailingList.entity";
import { WorkspaceModule } from "../workspace/workspace.module";
import { TypeORMModule } from "../../database/typeorm/typeorm.module";
import { MailingContacts } from "./mailingContacts.entity";
import { MailingListService } from "./mailingList.service";
import { MailingListResolver } from "./mailingList.resolver";

@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([MailingList,MailingContacts], 'core'),
        TypeORMModule,
        WorkspaceModule,
      ],
      services: [MailingListService],
    })
  ],
  controllers : [],
  providers : [MailingListResolver,MailingListService],
  exports: [ ],
})

export class MailingListModule {}