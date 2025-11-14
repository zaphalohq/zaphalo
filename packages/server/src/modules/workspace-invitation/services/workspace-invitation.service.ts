import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import crypto from 'crypto';

import {
  WorkspaceInvitationException,
  WorkspaceInvitationExceptionCode,
} from 'src/modules/workspace-invitation/workspace-invitation.exception';
import { AppToken, AppTokenType } from 'src/modules/app-token/app-token.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity'
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity'
import { castAppTokenToWorkspaceInvitationUtil } from 'src/modules/workspace-invitation/utils/cast-app-token-to-workspace-invitation.util';
import { SendInvitationsOutput } from 'src/modules/workspace-invitation/dtos/send-invitations.output';
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';

@Injectable()
export class WorkspaceInvitationService {
	constructor(
    @InjectRepository(AppToken, 'core')
    private readonly appTokenRepository: Repository<AppToken>,
    @InjectRepository(WorkspaceMember, 'core')
    private readonly workspaceMemebrRepository: Repository<WorkspaceMember>,
    private readonly configService: ConfigService,
    private readonly domainManagerService: DomainManagerService,
  ) {}

  async loadWorkspaceInvitations(workspace: Workspace) {
    const appTokens = await this.appTokenRepository.find({
      where: {
        workspaceId: workspace.id,
        type: AppTokenType.InvitationToken,
        deletedAt: IsNull(),
      },
      select: {
        value: false,
      },
    });

    return appTokens.map(castAppTokenToWorkspaceInvitationUtil);
  }

  async sendInvitations(
    emails: string[],
    workspace: Workspace,
    sender: WorkspaceMember,
    usePersonalInvitation = true,
  ): Promise<SendInvitationsOutput> {
    if (!workspace?.inviteToken) {
      return {
        success: false,
        errors: ['Workspace invite hash not found'],
        result: [],
      };
    }

    const invitationsPr = await Promise.allSettled(
      emails.map(async (email) => {
        if (usePersonalInvitation) {
          const appToken = await this.createWorkspaceInvitation(
            email,
            workspace,
          );

          if (!appToken.context?.email) {
            throw new Error(
              'Invalid email',
            );
          }

          return {
            isPersonalInvitation: true as const,
            appToken,
            email: appToken.context.email,
          };
        }

        return {
          isPersonalInvitation: false as const,
          email,
        };
      }),
    );

    for (const invitation of invitationsPr) {
      if (invitation.status === 'fulfilled') {
        const link = this.domainManagerService.buildWorkspaceURL({
          // workspace,
          pathname: `invite/${workspace?.inviteToken}`,
          searchParams: invitation.value.isPersonalInvitation
            ? {
                inviteToken: invitation.value.appToken.value,
                email: invitation.value.email,
              }
            : {},
        });


        // const emailData = {
        //   link: link.toString(),
        //   workspace: { name: workspace.name, logo: workspace.profileImg },
        //   sender: {
        //     email: sender.userEmail,
        //     firstName: sender.name.firstName,
        //     lastName: sender.name.lastName,
        //   },
        //   serverUrl: this.configService.get('SERVER_URL'),
        //   locale: sender.locale,
        // };

        // const emailTemplate = SendInviteLinkEmail(emailData);
        // const html = await render(emailTemplate);
        // const text = await render(emailTemplate, {
        //   plainText: true,
        // });

        // i18n.activate(sender.locale);

        // await this.emailService.send({
        //   from: `${sender.name.firstName} ${sender.name.lastName} (via Zaphalo) <${this.configService.get('EMAIL_FROM_ADDRESS')}>`,
        //   to: invitation.value.email,
        //   subject: t`Join your team on Zaphalo`,
        //   text,
        //   html,
        // });
      }
    }


    const result = invitationsPr.reduce<{
      errors: string[];
      result: ReturnType<
        typeof this.workspaceInvitationService.createWorkspaceInvitation
      >['status'] extends 'rejected'
        ? never
        : ReturnType<
            typeof this.workspaceInvitationService.appTokenToWorkspaceInvitation
          >;
    }>(
      (acc, invitation) => {
        if (invitation.status === 'rejected') {
          acc.errors.push(invitation.reason?.message ?? 'Unknown error');
        } else {
          acc.result.push(
            invitation.value.isPersonalInvitation
              ? castAppTokenToWorkspaceInvitationUtil(invitation.value.appToken)
              : { email: invitation.value.email },
          );
        }

        return acc;
      },
      { errors: [], result: [] },
    );

    return {
      success: result.errors.length === 0,
      ...result,
    };
  }

  async deleteWorkspaceInvitation(appTokenId: string, workspaceId: string) {
    const appToken = await this.appTokenRepository.findOne({
      where: {
        id: appTokenId,
        workspaceId,
        type: AppTokenType.InvitationToken,
      },
    });

    if (!appToken) {
      return 'error';
    }

    await this.appTokenRepository.delete(appToken.id);

    return 'success';
  }

  async getOneWorkspaceInvitation(workspaceId: string, email: string) {
    return await this.appTokenRepository
      .createQueryBuilder('appToken')
      .where('"appToken"."workspaceId" = :workspaceId', {
        workspaceId,
      })
      .andWhere('"appToken".type = :type', {
        type: AppTokenType.InvitationToken,
      })
      .andWhere('"appToken".context->>\'email\' = :email', { email })
      .getOne();
  }



  async createWorkspaceInvitation(email: string, workspace: Workspace) {
    const maybeWorkspaceInvitation = await this.getOneWorkspaceInvitation(
      workspace.id,
      email.toLowerCase(),
    );

    if (maybeWorkspaceInvitation) {
      throw new WorkspaceInvitationException(
        `${email} already invited`,
        WorkspaceInvitationExceptionCode.INVITATION_ALREADY_EXIST,
      );
    }

    const isUserAlreadyInWorkspace = await this.workspaceMemebrRepository.exists({
      where: {
        workspaceId: workspace.id,
        user: {
          email,
        },
      },
      relations: {
        user: true,
      },
    });

    if (isUserAlreadyInWorkspace) {
      throw new WorkspaceInvitationException(
        `${email} is already in the workspace`,
        WorkspaceInvitationExceptionCode.USER_ALREADY_EXIST,
      );
    }

    return this.generateInvitationToken(workspace.id, email);
  }

  async generateInvitationToken(workspaceId: string, email: string) {
    const expiresIn = '30d'

    // if (!expiresIn) {
    //   throw new AuthException(
    //     'Expiration time for invitation token is not set',
    //     AuthExceptionCode.INTERNAL_SERVER_ERROR,
    //   );
    // }

    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));

    const invitationToken = this.appTokenRepository.create({
      workspaceId,
      expiresAt,
      type: AppTokenType.InvitationToken,
      value: crypto.randomBytes(32).toString('hex'),
      context: {
        email,
      },
    });

    return this.appTokenRepository.save(invitationToken);
  }

}