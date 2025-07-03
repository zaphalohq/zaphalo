import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { GqlOptionsFactory } from '@nestjs/graphql';
import {
  YogaDriverConfig,
  YogaDriverServerContext,
} from '@graphql-yoga/nestjs';
import { GraphQLSchema, GraphQLError } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { GraphQLSchemaWithContext, YogaInitialContext } from 'graphql-yoga';
import * as Sentry from '@sentry/node';
import { CoreModule } from 'src/modules/core.module';
import { CustomerModule } from 'src/customer-modules/customer.module';


@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory<YogaDriverConfig<'express'>>{
  createGqlOptions(): YogaDriverConfig {
    const config: YogaDriverConfig = {
      autoSchemaFile: true,
      include: [CoreModule, CustomerModule],
      cors: {
        credentials: false,
      },
      context: ({ req }) => ({ req }), // Pass the HTTP request to context
    }
    return config;
  }
  }
