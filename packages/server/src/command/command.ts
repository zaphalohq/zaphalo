import { CommandFactory } from 'nest-commander';
import { CommandModule } from './command.module';

async function bootstrap() {
  const app = await CommandFactory.createWithoutRunning(CommandModule, {
    logger: ['error', 'warn', 'log'],
    bufferLogs: true,
  });

  await CommandFactory.runApplication(app);
}

bootstrap();
