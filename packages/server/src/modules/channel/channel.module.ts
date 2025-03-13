import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Channel } from "./channel.entity";
import { channelService } from "./channel.service";
import { channelController } from './channel.controller'
import { Message } from "./message.entity";
import { Contacts } from "../contacts/contacts.entity";
import { ContactsModule } from "../contacts/contacts.module";
import { WebSocketService } from "./chat-socket";


@Module({
    imports : [ NestjsQueryGraphQLModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature([Channel, Message], 'core'),
            TypeORMModule,
            ContactsModule,
          ],
          services: [channelService],
        //   resolvers: whatappinstanstsAutoResolverOpts,
        }),],
    controllers : [channelController],
    providers : [channelService, channelController , TypeORMModule, WebSocketService],
    exports: [channelController ],
})

export class channelModule {}