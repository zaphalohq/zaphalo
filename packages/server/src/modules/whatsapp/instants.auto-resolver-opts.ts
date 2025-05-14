import {
    AutoResolverOpts,
    ReadResolverOpts,
    PagingStrategies,
    FilterableField,
  } from '@ptc-org/nestjs-query-graphql';
  
import { WhatsappInstants } from './Instants.entity';
  // import { JwtAuthGuard } from 'src/constro/guards/jwt.auth.guard';
  
  export const whatappinstanstsAutoResolverOpts: AutoResolverOpts<
    any,
    any,
    unknown,
    unknown,
    ReadResolverOpts<any>,
    PagingStrategies
  >[] = [
    {
      EntityClass: WhatsappInstants,
      DTOClass: WhatsappInstants,
      enableTotalCount: true,
      pagingStrategy: PagingStrategies.CURSOR,
      read: {
        many: { disabled: true },
        one: { disabled: true },
      },
      create: {
        many: { disabled: true },
        one: { disabled: true },
      },
      update: {
        many: { disabled: true },
        one: { disabled: true },
      },
      delete: { many: { disabled: true }, one: { disabled: true } },
      // guards: [JwtAuthGuard],
    },
  ];