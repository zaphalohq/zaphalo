import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
// import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { Channel } from "./channel.entity";
import { ChannelService } from "./channel.service";
import { channelController } from './channel.controller'
import { Message } from "./message.entity";
import { Contacts } from "../contacts/contacts.entity";
import { ContactsModule } from "src/modules/contacts/contacts.module";
import { WebSocketService } from "./web.socket.service";
import { ChannelResolver } from "./channel.resolver";
import { UserService } from "src/modules/user/user.service";
import { UserModule } from "src/modules/user/user.module";
import { User } from "src/modules/user/user.entity";
import { fileupload } from "./fileupload.controller";
import { WorkspaceModule } from "src/modules/workspace/workspace.module";
import { instantsModule } from "src/modules/instants/instants.module";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";

@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Channel, Message, User], 'core'),
        TypeORMModule,
        ContactsModule,
        UserModule,
        WorkspaceModule,
        instantsModule
      ],
      services: [ChannelService],
    })
  ],
  controllers : [fileupload,channelController],
  providers : [fileupload, ChannelService, channelController, WebSocketService, ChannelResolver, UserService],
  exports: [channelController ],
})

export class channelModule {}