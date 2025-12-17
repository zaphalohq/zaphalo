// notification.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationDriverInterface } from 'src/modules/notification/drivers/interfaces/notification-driver.interface';
import { NOTIFICATION_DRIVER } from 'src/modules/notification/notification.constants';
import { NotificationDriverFactory } from 'src/modules/notification/notification.module-factory';
import { FcmToken } from 'src/modules/fcm-token/entities/fcm-token.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';

@Injectable()
export class NotificationService {
  constructor(
    // @Inject(NOTIFICATION_DRIVER)
    private readonly notificationDriverFactory: NotificationDriverFactory,
    @InjectRepository(FcmToken, 'core')
    private readonly fcmTokenRepository: Repository<FcmToken>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember, 'core')
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
  ) { }

  async sendPush(fcmToken, payload) {
    const driver = this.notificationDriverFactory.getDriver();

    return driver.sendPush(fcmToken, payload);
  }

  async sendMulticast(
    tokens: string[],
    payload,
  ) {
    if (!tokens.length) {
      return { successCount: 0, failureCount: 0 };
    }

    const driver = this.notificationDriverFactory.getDriver();

    const result = await driver.sendMulticast(tokens, payload);

    const invalidTokens: string[] = [];

    result.responses?.forEach((res, index) => {
      if (!res.success) {
        const code = res.error?.code;

        if (
          code === 'messaging/invalid-registration-token' ||
          code === 'messaging/registration-token-not-registered'
        ) {
          invalidTokens.push(tokens[index]);
        }
      }
    });

    if (invalidTokens.length) {
      await this.fcmTokenRepository.delete({
        token: In(invalidTokens),
      });
    }

    return {
      successCount: result.successCount,
      failureCount: result.failureCount,
    };
  }


  async sendNotification(workspaceId: string, payload) {

    const activeMembers = await this.workspaceMemberRepository.find({
      where: {
        workspaceId,
        active: true,
      },
      select: ['userId'],
    });

    const userIds = activeMembers.map(m => m.userId);

    const fcmTokens = await this.fcmTokenRepository.find({
      where: {
        userId: In(userIds),
      },
    });

    if (!fcmTokens.length) {
      return { successCount: 0, failureCount: 0 };
    }

    const tokens = fcmTokens.map(t => t.token);

    return await this.sendMulticast(tokens, payload)
  }
} 
