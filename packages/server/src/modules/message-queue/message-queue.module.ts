import {
  DynamicModule,
  Module,
  Global,
  Provider,
} from '@nestjs/common';
import PgBoss from 'pg-boss';
import { DiscoveryModule } from '@nestjs/core';
import {
  MessageQueueDriverType,
  PgBossDriverFactoryOptions
} from 'src/modules/message-queue/interfaces/message-queue-module-options.interface';
import { OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } from './message-queue-module.definition'
import { PgBossExplorer } from './message-queue.explorer';
import { PgBossDriver } from './drivers/pgboss.driver';
import { MessageQueue, QUEUE_DRIVER } from './message-queue.constants';
import { MessageQueueDriver } from 'src/modules/message-queue/drivers/interfaces/message-queue-driver.interface';
import { getQueueToken } from 'src/modules/message-queue/utils/get-queue-token.util';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';
import { MessageQueueMetadataAccessor } from 'src/modules/message-queue/message-queue-metadata.accessor';

@Global()
@Module({})
export class MessageQueueModule extends ConfigurableModuleClass {
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const dynamicModule = super.registerAsync(options);

    const driverProvider: Provider = {
      provide: QUEUE_DRIVER,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: async (...args: any[]) => {
        if (options.useFactory) {
          const config = await options.useFactory(...args);

          return this.createDriver(config);
        }
        throw new Error('useFactory is not defined');
      },
      inject: options.inject || [],
    };

    const queueProviders = MessageQueueModule.createQueueProviders();

    return {
      ...dynamicModule,
      imports: [...(options.imports || []), DiscoveryModule],
      providers: [
        ...(dynamicModule.providers ?? []),
        driverProvider, PgBossExplorer,
        ...queueProviders,
        MessageQueueMetadataAccessor,
      ],
      exports: [
        ...(dynamicModule.exports ?? []),
        ...Object.values(MessageQueue).map((queueName) =>
          getQueueToken(queueName),
          ),
      ],
    };
  }

  static async createDriver({ type, options }: typeof OPTIONS_TYPE) {
    switch (type) {
      case MessageQueueDriverType.PgBoss: {
        return new PgBossDriver(options);
      }
      default: {
        console.warn(
          `Unsupported message queue driver type: ${type}. Using SyncDriver by default.`,
        );
      }
    }
  }
  static createQueueProviders(): Provider[] {
    return Object.values(MessageQueue).map((queueName) => ({
      provide: getQueueToken(queueName),
      useFactory: (driver: MessageQueueDriver) => {
        return new MessageQueueService(driver, queueName);
      },
      inject: [QUEUE_DRIVER],
    }));
  }
}