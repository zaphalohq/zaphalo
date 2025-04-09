import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // Increase the payload size limit (e.g., 10MB)
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
    // app.enableCors({
    //   origin: 'http://localhost:5173', // React app origin
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   credentials: true,
    // });
    app.enableCors({
      origin: ['http://192.168.1.2:5173', 'http://localhost:5173'], // React app origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    app.enableCors();
    // app.use(passport.initialize());
    app.useStaticAssets(path.join(__dirname, "../uploads"))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
