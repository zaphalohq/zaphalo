import { Module, DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';
import { join } from 'path';

import { GraphQLConfigModule } from './modules/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './modules/api/graphql-config/graphql-config.service';
import { CustomerModule } from 'src/customer-modules/customer.module';
import { CoreModule } from 'src/modules/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [GraphQLConfigModule],
      useClass: GraphQLConfigService, 
    }),
    CoreModule,
    CustomerModule,
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

    // Messaque Queue explorer only for sync driver
    // Maybe we don't need to conditionaly register the explorer, because we're creating a jobs module
    // that will expose classes that are only used in the queue worker
    /*
    if (process.env.MESSAGE_QUEUE_TYPE === MessageQueueDriverType.Sync) {
      modules.push(MessageQueueModule.registerExplorer());
    }
    */

    return modules;
  }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(GraphQLHydrateRequestFromTokenMiddleware)
  //     .forRoutes({ path: 'graphql', method: RequestMethod.ALL });

  //   consumer
  //     .apply(GraphQLHydrateRequestFromTokenMiddleware)
  //     .forRoutes({ path: 'metadata', method: RequestMethod.ALL });

  //   for (const method of MIGRATED_REST_METHODS) {
  //     consumer.apply(RestCoreMiddleware).forRoutes({ path: 'rest/*', method });
  //   }
  // }
}
