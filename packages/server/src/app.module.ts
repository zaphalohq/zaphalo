import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { SentryModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { CoreModule } from './core/modules/core.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLConfigModule } from './core/api/graphql-config/graphql-config.module';
import { GraphQLConfigService } from './core/api/graphql-config/graphql-config.service';
import { TypeORMModule } from './database/typeorm/typeorm.module';

@Module({
  imports: [
    // SentryModule.forRoot(),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [GraphQLConfigModule],
      useClass: GraphQLConfigService,
      
    }),
    CoreModule,
],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
