export interface NotificationDriverInterface {
  sendPush(
    token: string,
    payload: {
      title: string;
      body: string;
      data?: Record<string, string>;
    },
  ): Promise<string | null>;
}
