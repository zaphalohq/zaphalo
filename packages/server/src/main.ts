import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { ConfigService } from '@nestjs/config';

import { WorkspaceMiddleware } from 'src/modules/workspace-manager/workspace.manager.middleware';
import { UnhandledExceptionFilter } from 'src/filters/unhandled-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useGlobalFilters(new UnhandledExceptionFilter());

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(new WorkspaceMiddleware().use);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get(ConfigService);
  app.useStaticAssets(path.join(__dirname, "../uploads"))

  await app.listen(Number(configService.get('PORT') | 3000));
}
bootstrap();
