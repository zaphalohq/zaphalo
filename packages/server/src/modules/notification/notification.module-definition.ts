import { ConfigurableModuleBuilder } from '@nestjs/common';

import { NotificationModuleOptions } from 'src/modules/notification/interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<NotificationModuleOptions>({
  moduleName: 'NotificationModule',
})
  .setClassMethodName('forRoot')
  .build();
console.log("...............OPTIONS_TYPE.............", OPTIONS_TYPE)