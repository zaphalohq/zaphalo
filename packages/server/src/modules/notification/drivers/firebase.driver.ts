import { App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { NotificationDriverInterface } from 'src/modules/notification/drivers/interfaces/notification-driver.interface';


export class FirebaseDriver implements NotificationDriverInterface {
  constructor(private readonly app: App) {}

  async sendPush(token: string, payload: any): Promise<string> {
    const message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    };

    return getMessaging(this.app).send(message);
  }

  async sendMulticast(tokens: string[], payload: any) {
    const message = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    };

    const response = await getMessaging(this.app).sendEachForMulticast(message);

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
  }
}
