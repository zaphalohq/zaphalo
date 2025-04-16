import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Contacts } from "../contacts/contacts.entity";
import { ContactsModule } from "../contacts/contacts.module";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { User } from "../user/user.entity";
import { workspaceService } from "./workspace.service";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";


@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([User, Workspace, WorkspaceMember], 'core'),
        TypeORMModule,
        ContactsModule,
        UserModule, // UserService is exported from here
      ],
      services: [workspaceService],
    }),
  ],
  providers: [workspaceService],
  exports: [workspaceService],
})
export class workspaceModule {}