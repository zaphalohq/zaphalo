import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
import { Channel } from "./channel.entity";
import { ChannelService } from "./channel.service";
import { Message } from "./message.entity";
import { WebSocketService } from "./chat-socket";
import { User } from "src/modules/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { UserModule } from "src/modules/user/user.module";
import { WorkspaceModule } from "src/modules/workspace/workspace.module";
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { WhatsAppModule } from "src/customer-modules/whatsapp/whatsapp.module";
import { ContactsModule } from "src/customer-modules/contacts/contacts.module";
import { JwtModule } from "src/modules/jwt/jwt.module";
import { AttachmentModule } from "../attachment/attachment.module";
import { FileStorageModule } from "src/modules/file-storage/file-storage.module";
import { channelController } from "./channel.controller";
import { MessageResolver } from "./resolvers/message.resolver";
import { ChannelResolver } from "./resolvers/channel.resolver";

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Channel, Message]),
        NestjsQueryTypeOrmModule.forFeature([User], 'core'),
        TypeORMModule,
        ContactsModule,
        UserModule,
        WorkspaceModule,
        WhatsAppModule,
        JwtModule,
        AttachmentModule,
        FileStorageModule
      ],
      services: [ChannelService],
    })
  ],
  controllers: [ channelController],
  providers: [ ChannelService, channelController, WebSocketService, ChannelResolver, MessageResolver , UserService],
  exports: [channelController],
})

export class channelModule { }