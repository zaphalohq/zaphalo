import { forwardRef, Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { User } from "../user/user.entity";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceMemberService } from "./workspaceMember.service";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { workspaceResolver } from "./workspace.resolver";
import { WorkspaceInvitation } from "./workspaceInvitation.entity";
import { Contacts } from "src/customer-modules/contacts/contacts.entity";

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature(
          [
            User,
            Workspace,
            WorkspaceMember,
            WorkspaceInvitation,
            // Contacts
          ],
          'core'
        ),
        TypeORMModule,
        UserModule, // UserService is exported from here
      ],
      services: [WorkspaceService, WorkspaceMemberService],
      
    }),
  ],
  providers: [WorkspaceService, workspaceResolver, WorkspaceMemberService],
  exports: [WorkspaceService, workspaceResolver, WorkspaceMemberService],
})
export class WorkspaceModule {}