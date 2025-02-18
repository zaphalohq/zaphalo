import {
    AutoResolverOpts,
    ReadResolverOpts,
    PagingStrategies,
    FilterableField,
  } from '@ptc-org/nestjs-query-graphql';
  
  import { User } from './user.entity';
  // import { JwtAuthGuard } from 'src/constro/guards/jwt.auth.guard';
  
  export const userAutoResolverOpts: AutoResolverOpts<
    any,
    any,
    unknown,
    unknown,
    ReadResolverOpts<any>,
    PagingStrategies
  >[] = [
    {
      EntityClass: User,
      DTOClass: User,
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