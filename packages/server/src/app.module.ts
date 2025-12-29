import { Module, DynamicModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { GraphQLConfigModule } from './modules/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './modules/api/graphql-config/graphql-config.service';
import { CustomerModule } from 'src/customer-modules/customer.module';
import { CoreModule } from 'src/modules/core.module';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { HttpMiddleware } from 'src/middlewares/http.middleware';
import { MiddlewareModule } from 'src/middlewares/middleware.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [GraphQLConfigModule],
      useClass: GraphQLConfigService, 
    }),
    CoreModule,
    CustomerModule,
    MiddlewareModule,
    ...AppModule.getConditionalModules(),
],
})

export class AppModule {
  private static getConditionalModules(): DynamicModule[] {
    const modules: DynamicModule[] = [];
    const frontPath = join(__dirname, '..', 'frontend');
    if (existsSync(frontPath)) {
      modules.push(
        ServeStaticModule.forRoot({
          rootPath: frontPath,
        }),
      );
    }
    return modules;
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: 'graphql', method: RequestMethod.ALL },
      );

    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: '/upload', method: RequestMethod.ALL },
      );

    consumer
      .apply(HttpMiddleware)
      .forRoutes(
        { path: '/whatsapp/*path', method: RequestMethod.ALL },
      );

    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: '/uploadExcel', method: RequestMethod.ALL },
      );  
  }

}
