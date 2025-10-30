import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
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
import { MessageResolver } from "./resolvers/message.resolver";
import { ChannelResolver } from "./resolvers/channel.resolver";

import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { Message } from "src/customer-modules/channel/entities/message.entity";
import { MessageReaction } from "src/customer-modules/channel/entities/message-reaction.entity";
import { ChannelService } from "src/customer-modules/channel/services/channel.service";
import { ContactUpdatedListener } from "./listner/contact.updated-listner";


@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Channel, Message, MessageReaction]),
        NestjsQueryTypeOrmModule.forFeature([User], 'core'),
        TypeORMModule,
        ContactsModule,
        UserModule,
        WorkspaceModule,
        JwtModule,
        AttachmentModule,
        FileStorageModule
      ],
    }),
    WhatsAppModule,
  ],
  providers: [
    ChannelService,
    WebSocketService,
    ChannelResolver,
    MessageResolver,
    UserService,
    ContactUpdatedListener
  ],
  exports: [ChannelService]
})

export class ChannelModule { }