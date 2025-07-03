import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { WorkspaceMiddleware } from 'src/modules/workspace-manager/workspace.manager.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
    // rawBody: true,
  });
  app.use(new WorkspaceMiddleware().use);
  // Increase the payload size limit (e.g., 10MB)
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 app.use(new WorkspaceMiddleware().use);
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, "../uploads"))

  await app.listen(Number(process.env.PORT));
}
bootstrap();
