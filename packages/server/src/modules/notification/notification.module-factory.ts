// import { HttpAdapterHost } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';

import { OPTIONS_TYPE } from 'src/modules/notification/notification.module-definition';
import { NotificationDriverType } from 'src/modules/notification/interfaces';
import { NotificationDriverInterface } from 'src/modules/notification/drivers/interfaces/notification-driver.interface';
import { FirebaseDriver } from 'src/modules/notification/drivers/firebase.driver';
import { FirebaseDisabledDriver } from 'src/modules/notification/drivers/firebase-disabled.driver';
// /**
//  * ExceptionHandler Module factory
//  * @returns ExceptionHandlerModuleOptions
//  * @param adapterHost
//  */
// export const notificationModuleFactory = async (
// ): Promise<typeof OPTIONS_TYPE> => {
//     return {
//       type: NotificationDriver.FIREBASE,
//     };
// };


@Injectable()
export class NotificationDriverFactory {
  constructor(private readonly config: ConfigService) {}

  getDriver(): NotificationDriverInterface {
    const driver = this.config.get<NotificationDriverType>(
      'NOTIFICATION_DRIVER',
      NotificationDriverType.DISABLED,
    );
    let firebaseApp;
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
    }else{
      firebaseApp = initializeApp({
        credential: cert({
          projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.config
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        }),
      });
    }
    console.log("..................driver............", driver)
    switch (driver) {
      case NotificationDriverType.FIREBASE:
        return new FirebaseDriver(firebaseApp);

      case NotificationDriverType.DISABLED:
      default:
        return new FirebaseDisabledDriver();
    }
  }
}
