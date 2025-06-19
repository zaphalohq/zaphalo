import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeORMModule } from './database/typeorm/typeorm.module';
import { GraphQLConfigModule } from './modules/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './modules/api/graphql-config/graphql-config.service';
import { CoreModule } from './modules/core.module';
import { instantsModule } from './modules/whatsapp/instants.module';


@Module({
  imports: [
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [GraphQLConfigModule],
      useClass: GraphQLConfigService, 
    }),
    CoreModule,
    instantsModule,
],
})
export class AppModule {}
