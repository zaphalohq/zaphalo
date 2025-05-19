/* eslint-disable no-restricted-imports */
import { Module,  NestModule, RequestMethod, MiddlewareConsumer} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { User } from "./user.entity";
// import { TypeORMModule } from "../../../database/typeorm/typeorm.module";
// import { TypeORMService } from "../../../database/typeorm/typeorm.service";
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { userAutoResolverOpts } from './user.auto-resolver-opts';
import { userDTO } from './dto/user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([User], 'core'),
        TypeORMModule
      ],
      services: [UserService],
      // resolvers: [
      //   {
      //     DTOClass: userDTO,
      //     EntityClass: User,
      //     CreateDTOClass: CreateUserDTO,
      //     ServiceClass: UserService,
      //     enableAggregate: true
      //   }
      // ],
      resolvers: userAutoResolverOpts,
    }),
  ],
  exports: [UserService],
  providers: [UserService, UserResolver, TypeORMModule],
})

export class UserModule {}

// import { Module } from '@nestjs/common'
// import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql'
// import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm'

// // import { SubTaskDTO } from './dto/sub-task.dto'
// // import { CreateSubTaskDTO } from './dto/subtask-input.dto'
// // import { SubTaskUpdateDTO } from './dto/subtask-update.dto'
// // import { SubTaskEntity } from './sub-task.entity'
// // import { SubTaskService } from './sub-task.service'

// import { userDTO } from './dto/user.dto';
// import { CreateUserDTO } from './dto/create-user.dto';

// @Module({
//   imports: [
//     NestjsQueryGraphQLModule.forFeature({
//       imports: [NestjsQueryTypeOrmModule.forFeature([User], 'core'), TypeORMModule],
//       services: [UserService],
//       resolvers: [
//         {
//           DTOClass: userDTO,
//           EntityClass: User,
//           CreateDTOClass: CreateUserDTO,
//           // UpdateDTOClass: SubTaskUpdateDTO,
//           ServiceClass: UserService,
//           enableAggregate: true
//         }
//       ]
//     })
//   ]
// })
// export class UserModule {}