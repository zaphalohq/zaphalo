import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { AppToken } from 'src/modules/app-token/app-token.entity'
import { WorkspceInvitationResolver } from 'src/modules/workspace-invitation/workspace-invitation.resolver';
import { WorkspaceInvitationService } from 'src/modules/workspace-invitation/services/workspace-invitation.service';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
import { TokenModule } from 'src/modules/auth/token/token.module';
import { DomainManagerModule } from 'src/modules/domain-manager/domain-manager.module';

@Module({
  imports: [
    DomainManagerModule,
    NestjsQueryTypeOrmModule.forFeature(
      [AppToken, Workspace, WorkspaceMember],
      'core'
    ),
    TokenModule,
  ],
  providers: [
    WorkspaceInvitationService, WorkspceInvitationResolver,
  ],
  exports: [
    WorkspaceInvitationService,
  ]
})


export class WorkspaceInvitationModule{}

