import { ConfigurableModuleBuilder } from '@nestjs/common';

import { PgBossDriverFactoryOptions } from './interfaces/message-queue-module-options.interface';

export const {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<PgBossDriverFactoryOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
