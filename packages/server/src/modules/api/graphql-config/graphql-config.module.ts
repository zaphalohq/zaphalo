import { Module } from '@nestjs/common';
import { GraphQLConfigService } from './graphql-config.service';
import { CoreModule } from 'src/modules/core.module';
import { CustomerModule } from 'src/customer-modules/customer.module';

@Module({
  imports: [CoreModule, CustomerModule],
  providers: [GraphQLConfigService],
  exports: [CoreModule, CustomerModule],
})
export class GraphQLConfigModule {}
