import { Module } from '@nestjs/common';
import { GraphQLConfigService } from './graphql-config.service';
import { CoreModule } from 'src/modules/core.module';
import { instantsModule } from 'src/modules/whatsapp/instants.module';

@Module({
  imports: [CoreModule, instantsModule],
  providers: [GraphQLConfigService],
  exports: [CoreModule, instantsModule],
})
export class GraphQLConfigModule {}
