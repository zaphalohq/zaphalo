import { DynamicModule, Global, Module } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

import { FirebaseDriver } from 'src/modules/notification/drivers/firebase.driver';
import { FirebaseDisabledDriver } from 'src/modules/notification/drivers/firebase-disabled.driver';
import { NOTIFICATION_DRIVER } from 'src/modules/notification/notification.constants';

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from 'src/modules/notification/notification.module-definition';
import { NotificationService } from 'src/modules/notification/notification.service';

import { NotificationDriverFactory } from 'src/modules/notification/notification.module-factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from '../fcm-token/entities/fcm-token.entity';
import { Workspace } from '../workspace/workspace.entity';
import { User } from '../user/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(
    [
      FcmToken,
      Workspace,
      User,
    ], 'core')],
  providers: [NotificationDriverFactory, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }