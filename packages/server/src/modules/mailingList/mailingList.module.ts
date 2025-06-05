import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { MailingList } from "./mailingList.entity";
import { WorkspaceModule } from "../workspace/workspace.module";
import { TypeORMModule } from "../../database/typeorm/typeorm.module";
import { MailingContacts } from "./mailingContacts.entity";
import { MailingListService } from "./mailingList.service";
import { MailingListResolver } from "./mailingList.resolver";
import { MailingListController } from "./mailingList.controller";

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
  controllers : [MailingListController],
  providers : [MailingListResolver,MailingListService],
  exports: [ MailingListService],
})

export class MailingListModule {}