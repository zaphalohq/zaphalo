import { NotificationDriverInterface } from 'src/modules/notification/drivers/interfaces/notification-driver.interface';

export class FirebaseDisabledDriver implements NotificationDriverInterface {
  async sendPush(): Promise<null> {
    return null;
  }

  async sendMulticast(tokens: string[]) {
    return {
      successCount: 0,
      failureCount: tokens.length,
    };
  }
}
