import { Router } from 'express';

export enum NotificationDriverType {
  DISABLED = 'DISABLED',
  FIREBASE = 'FIREBASE',
}

export interface NotificationDriverFactoryOptions {
  type: NotificationDriverType.FIREBASE;
}

export interface NotificationDisabledDriverFactoryOptions {
  type: NotificationDriverType.DISABLED;
}


export type NotificationModuleOptions =
  | NotificationDisabledDriverFactoryOptions
  | NotificationDriverFactoryOptions;