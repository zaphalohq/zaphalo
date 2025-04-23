import { forwardRef, Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { contactsResolver } from "./contacts.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";
import { WorkspaceService } from "../workspace/workspace.service";

@Module({
    imports : [ 
      NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Contacts], 'core'),
            TypeORMModule,
            WorkspaceModule,
          ],
          services: [ContactsService],
        //   resolvers: whatappinstanstsAutoResolverOpts,
        }),],
    providers : [ContactsService, contactsResolver],
    exports: [ContactsService],
})

export class ContactsModule {}