import { Module } from '@nestjs/common';

// import { ConstroModule } from 'src/constro/modules/constro.module';
import { GraphQLConfigService } from './graphql-config.service';
import { CoreModule } from 'src/modules/core.module';
import { instantsModule } from 'src/modules/whatsapp/instants.module';
// import { TodoItemModule } from 'src/constro/modules/todo-item/todo-item.module';


@Module({
  imports: [CoreModule, instantsModule],
  providers: [GraphQLConfigService],
  exports: [CoreModule, instantsModule],
})
export class GraphQLConfigModule {}
