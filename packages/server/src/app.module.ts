import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeORMModule } from './database/typeorm/typeorm.module';
import { GraphQLConfigModule } from './modules/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './modules/api/graphql-config/graphql-config.service';
import { CoreModule } from './modules/core.module';
import { CustomerModule } from 'src/customer-modules/customer.module';
import { instantsModule } from './customer-modules/instants/instants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [GraphQLConfigModule],
      useClass: GraphQLConfigService, 
    }),
    CustomerModule,
    instantsModule,
],
})
export class AppModule {}
