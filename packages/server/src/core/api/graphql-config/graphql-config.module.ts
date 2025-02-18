import { Module } from '@nestjs/common';

// import { ConstroModule } from 'src/constro/modules/constro.module';
import { CoreModule } from '../../modules/core.module';
import { GraphQLConfigService } from './graphql-config.service';
// import { TodoItemModule } from 'src/constro/modules/todo-item/todo-item.module';


@Module({
  imports: [CoreModule],
  providers: [GraphQLConfigService],
  exports: [CoreModule],
})
export class GraphQLConfigModule {}
