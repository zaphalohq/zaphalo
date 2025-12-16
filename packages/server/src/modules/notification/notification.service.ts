// notification.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { NotificationDriverInterface } from 'src/modules/notification/drivers/interfaces/notification-driver.interface';
import { NOTIFICATION_DRIVER } from 'src/modules/notification/notification.constants';
import { NotificationDriverFactory } from 'src/modules/notification/notification.module-factory';

@Injectable()
export class NotificationService {
  constructor(
    // @Inject(NOTIFICATION_DRIVER)
    private readonly notificationDriverFactory: NotificationDriverFactory,
  ) {}

  async sendPush(fcmToken) {
    const driver = this.notificationDriverFactory.getDriver();

    console.log("..........driver...................", driver)
    return driver.sendPush(fcmToken, {
      title: 'Hello 👋',
      body: 'Firebase push notification works!',
      data: {
        screen: 'home',
      },
    });
  }
}
