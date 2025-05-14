import { forwardRef, Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Contacts } from "../contacts/contacts.entity";
import { ContactsModule } from "../contacts/contacts.module";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { User } from "../user/user.entity";
import { WorkspaceService } from "./workspace.service";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { workspaceResolver } from "./workspace.resolver";
import { WorkspaceInvitation } from "./workspaceInvitation.entity";


@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([User, Workspace, WorkspaceMember, WorkspaceInvitation, Contacts], 'core'),
        TypeORMModule,
        UserModule, // UserService is exported from here
      ],
      services: [WorkspaceService],
      
    }),
  ],
  providers: [WorkspaceService, workspaceResolver],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}