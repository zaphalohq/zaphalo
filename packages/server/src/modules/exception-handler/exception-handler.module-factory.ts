import { HttpAdapterHost } from '@nestjs/core';

import { OPTIONS_TYPE } from 'src/modules/exception-handler/exception-handler.module-definition';
import { ExceptionHandlerDriver } from 'src/modules/exception-handler/interfaces';

/**
 * ExceptionHandler Module factory
 * @returns ExceptionHandlerModuleOptions
 * @param adapterHost
 */
export const exceptionHandlerModuleFactory = async (
  adapterHost: HttpAdapterHost,
): Promise<typeof OPTIONS_TYPE> => {
    return {
      type: ExceptionHandlerDriver.CONSOLE,
    };
};
