import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { YogaDriverConfig } from '@graphql-yoga/nestjs';
import { CoreModule } from 'src/modules/core.module';
import { CustomerModule } from 'src/customer-modules/customer.module';


@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory<YogaDriverConfig<'express'>> {
  createGqlOptions(): YogaDriverConfig {
    const config: YogaDriverConfig = {
      autoSchemaFile: true,
      include: [CoreModule, CustomerModule],
      cors: {
        credentials: false,
      },
      context: ({ req }) => ({ req })
    }
    return config;
  }
}
