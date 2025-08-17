import { MessageQueueDriverType, PgBossDriverFactoryOptions } from './interfaces/message-queue-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable, Req } from '@nestjs/common';

export const QueueManagerModuleFactory = async (
  configService: ConfigService,
): Promise<PgBossDriverFactoryOptions> => {
	const connectionString = configService.get('PG_DATABASE_URL');
  return {
    type: MessageQueueDriverType.PgBoss,
    options: {
      connectionString,
    },
  } satisfies PgBossDriverFactoryOptions;
}