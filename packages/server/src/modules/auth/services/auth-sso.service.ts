import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { WorkspaceAuthProvider } from 'src/modules/workspace/types/workspace.type';
import { Workspace } from 'src/modules/workspace/workspace.entity';

@Injectable()
export class AuthSsoService {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  private getAuthProviderColumnNameByProvider(
    authProvider: WorkspaceAuthProvider,
  ) {
    if (authProvider === 'google') {
      return 'isGoogleAuthEnabled';
    }

    if (authProvider === 'microsoft') {
      return 'isMicrosoftAuthEnabled';
    }

    if (authProvider === 'password') {
      return 'isPasswordAuthEnabled';
    }

    throw new Error(`${authProvider} is not a valid auth provider.`);
  }

  async findWorkspaceFromWorkspaceIdOrAuthProvider(
    {
      authProvider,
      email,
    }: { authProvider: WorkspaceAuthProvider; email: string },
    workspaceId?: string,
  ) {
    if (
      process.env.IS_MULTIWORKSPACE_ENABLED &&
      !workspaceId &&
      email !== undefined
    ) {
      // Multi-workspace enable mode but on non workspace url.
      // so get the first workspace with the current auth method enable
      const workspace = await this.workspaceRepository.findOne({
        where: {
          // [this.getAuthProviderColumnNameByProvider(authProvider)]: true,
          members: {
            user: {
              email,
            },
          },
        },
        // relations: [
        //   'workspaceUsers',
        //   'workspaceUsers.user',
        //   'approvedAccessDomains',
        // ],
      });
      return workspace ?? undefined;
    }
    return await this.workspaceRepository.findOne({
      where: {
        id: workspaceId,
      },
      // relations: ['approvedAccessDomains'],
    });
  }
}
