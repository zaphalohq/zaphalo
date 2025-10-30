import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { workspaceResolver } from "./workspace.resolver";
import { workspaceMemberResolver } from "src/modules/workspace/resolvers/workspace-member.resolver";

import { WorkspaceMember } from "./workspaceMember.entity";
import { WorkspaceMemberService } from "./workspaceMember.service";
import { WorkspaceInvitation } from "./workspaceInvitation.entity";
import { User } from "src/modules/user/user.entity";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { UserModule } from "src/modules/user/user.module";
import { AppTokenModule } from "src/modules/app-token/app-token.module";
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { DomainManagerModule } from 'src/modules/domain-manager/domain-manager.module';


@Module({
  imports: [
    DomainManagerModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature(
          [
            User,
            Workspace,
            WorkspaceMember,
            WorkspaceInvitation,
          ],
          'core'
        ),
        TypeORMModule,
        UserModule,
        AppTokenModule,
        FileStorageModule
      ],
      services: [WorkspaceService, WorkspaceMemberService],
    }),
  ],
  providers: [WorkspaceService, workspaceResolver, workspaceMemberResolver, WorkspaceMemberService],
  exports: [WorkspaceService, workspaceResolver, WorkspaceMemberService],
})
export class WorkspaceModule {}