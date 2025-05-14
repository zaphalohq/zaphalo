import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Contacts } from "./contacts.entity";
import { contactsService } from "./contacts.service";
import { contactsResolver } from "./contacts.resolver";

@Module({
    imports : [ NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Contacts], 'core'),
            TypeORMModule,
          ],
          services: [contactsService],
        //   resolvers: whatappinstanstsAutoResolverOpts,
        }),],
    providers : [contactsService, contactsResolver ],
    exports: [contactsService,],
})

export class ContactsModule {}