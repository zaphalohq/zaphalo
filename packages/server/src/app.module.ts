import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeORMModule } from './database/typeorm/typeorm.module';
import { GraphQLConfigModule } from './modules/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './modules/api/graphql-config/graphql-config.service';
import { CoreModule } from './modules/core.module';
<<<<<<< HEAD
import { instantsModule } from './modules/instants/instants.module';
=======
import { instantsModule } from './modules/whatsapp/instants.module';
import { CustomerModule } from 'src/customer-modules/customer.module';
>>>>>>> c0debf2084f8038e1fbf00371fe74002b2f2e1b8

@Module({
  imports: [
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
