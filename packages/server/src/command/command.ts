import { CommandFactory } from 'nest-commander';
import { CommandModule } from './command.module';
import { CommandLogger } from 'src/database/commands/logger';

async function bootstrap() {
  const errorHandler = (err: Error) => {
    console.error(err?.message, err?.name);
  };

  const app = await CommandFactory.createWithoutRunning(CommandModule, {
    logger: ['error', 'warn', 'log'],
    bufferLogs: false,
    errorHandler,
    serviceErrorHandler: errorHandler,
  });

  await CommandFactory.runApplication(app);
  app.close();
}

bootstrap();
