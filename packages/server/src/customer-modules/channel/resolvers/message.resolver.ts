import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Int,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { message } from "aws-sdk/clients/sns";

import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { ContactsService } from "src/customer-modules/contacts/contacts.service";
import { FileService } from "src/modules/file-storage/services/file.service";
import { ChannelService } from "src/customer-modules/channel/services/channel.service";
import { Message } from "src/customer-modules/channel/entities/message.entity";
import { SuccessResponse } from "src/customer-modules/whatsapp/dtos/success.dto";
import { SendMessageInput } from "src/customer-modules/channel/dtos/SendMessageInputDto";
import { ManyChannelMessageResponse } from "src/customer-modules/channel/dtos/many-channel-message-response.dto";
import { MessageEdge } from "src/customer-modules/channel/dtos/message-response.dto";
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";


@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly channelService: ChannelService,
    private readonly attachmentService: AttachmentService,
    private readonly waAccountService: WaAccountService,
    private fileService: FileService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findMsgByChannelId(@Context('req') req, @Args('channelId') channelId: string): Promise<Message[] | Message> {
    const messages = await this.channelService.findMsgByChannelId(channelId);
    await this.channelService.makeUnseenSeen(messages);
    return messages
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findAllUnseen() {
    const unseenMessages = await this.channelService.findAllUnseen()
    return unseenMessages
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SuccessResponse)
  async makeUnseenMsgSeenByMsgId(@Args('messageId') messageId: string) {
    const unseenMessages = await this.channelService.makeUnseenSeen(undefined, messageId)
    return {
      success: true,
      message: 'All messages seen'
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [Message])
  async sendMessage(
    @AuthWorkspace() workspace: Workspace,
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ): Promise<Message[] | []> {

    const { textMessage, channelName, channelId, attachments } = sendMessageInput;
    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const senderId = Number(findTrueInstants?.phoneNumberId)

    const returnMessage : Message[] = [];
    const receiverId = sendMessageInput?.receiverId.filter((number: any) => number != senderId)
    if ((!attachments || attachments.length === 0) && textMessage) {
      const messageType = 'text'
      if (!channelId || channelId === '') {
        const memberIds = [...receiverId, senderId];
        const channel: any = await this.channelService.findOrCreateChannel(
          senderId,
          memberIds,
          channelName,
        );
        if (!channel.channel.id) throw new Error('Channel not found');
         const message : Message[] = await this.channelService.createMessage(
          workspace.id,
          textMessage,
          channel.channel.id,
          messageType,
          // waMessageIds,
          true
        );
        returnMessage.push(message[0])
      } else {
        const message = await this.channelService.createMessage(
          workspace.id,
          textMessage,
          channelId,
          messageType,
          // waMessageIds,
          true
        );
        returnMessage.push(message[0])
      }
    }
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        // const wa_api = await this.waAccountService.getWhatsAppApi();
        // const dbAttachment = await this.attachmentService.findOneAttachmentById(attachment.attachmentId);
        // const attachmentUploadtoWaApiId = await wa_api._upload_whatsapp_document(dbAttachment);
        // if (!waMessageIds) throw Error('message not send to whatsapp')
        if (!channelId || channelId === '') {
          const memberIds = [...receiverId, senderId];
          const channel: any = await this.channelService.findOrCreateChannel(
            senderId,
            memberIds,
            channelName,
          );
          if (!channel.channel.id) throw new Error('Channel not found');
          const message =  await this.channelService.createMessage(
            workspace.id,
            textMessage,
            channel.channel.id,
            attachment.messageType,
            // waMessageIds,
            true,
            attachment.attachmentId
          );
          returnMessage.push(message[0])
        } else {
          const message = await this.channelService.createMessage(
            workspace.id,
            textMessage,
            channelId,
            attachment.messageType,
            // waMessageIds,
            true,
            attachment.attachmentId
          );
          returnMessage.push(message[0])
        }
      }
    }
    return returnMessage
  }


  @UseGuards(GqlAuthGuard)
  @ResolveField(() => String)
  async attachmentUrl(@Parent() message: Message, @Context() context): Promise<string> {
    const workspaceId = context.req.headers['x-workspace-id']
    if (message.attachmentUrl) {
      try {
        const workspaceLogoToken = this.fileService.encodeFileToken({
          workspaceId: workspaceId,
        });

        return `${message.attachmentUrl}?token=${workspaceLogoToken}`;

      } catch (e) {
        return message.attachmentUrl;
      }
    }
    return message.attachmentUrl ?? '';
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => ManyChannelMessageResponse)
  async searchReadChannelMessage(
    @Args('channelId', { type: () => String }) channelId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
  ) {
    if(!search)
      search = ''
    if(!filter)
      filter = ''
    const response = await this.channelService.searchReadChannelMessage(channelId, page, pageSize, search, filter)
    return response
  }

  @Query(() => MessageEdge)
  async messages(
    @Args('channelId', { type: () => String }) channelId: string,
    @Args('cursor', { type: () => String, nullable: true }) cursor: string,
    @Args('limit', { type: () => Int}) limit: number,
  ): Promise<MessageEdge> {
    return this.channelService.getMessages(channelId, cursor, limit);
  }

}

