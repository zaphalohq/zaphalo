import { forwardRef, Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { contactsResolver } from "./contacts.resolver";
import { WorkspaceModule } from "src/modules/workspace/workspace.module";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports : [ 
      TypeOrmModule.forFeature([Contacts]),
            // WorkspaceModule,
      ],
    providers : [ContactsService, contactsResolver],
    exports: [ContactsService],
})

export class ContactsModule {}