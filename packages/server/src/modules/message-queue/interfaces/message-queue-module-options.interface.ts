import PgBoss from 'pg-boss';
import { PgBossDriverOptions } from '../drivers/pgboss.driver';

export enum MessageQueueDriverType {
  PgBoss = 'pg-boss',
}

export interface PgBossDriverFactoryOptions {
  type: MessageQueueDriverType.PgBoss;
  options: PgBossDriverOptions;
}