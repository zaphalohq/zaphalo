import { ConsoleLogger } from '@nestjs/common';

export class CommandLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    super.error(message, stack, context);
  }
}
