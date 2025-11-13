import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ExceptionHandlerModuleOptions } from 'src/modules/exception-handler/interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ExceptionHandlerModuleOptions>({
  moduleName: 'ExceptionHandlerModule',
})
  .setClassMethodName('forRoot')
  .build();
