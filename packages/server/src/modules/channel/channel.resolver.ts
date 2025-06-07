import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { Channel } from "./channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelService } from "./channel.service";
import { Message } from "./message.entity";
import { Request, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { SendMessageInput, SendMessageResponse } from "./dto/SendMessageInputDto";
import axios from 'axios'
import { instantsService } from "../whatsapp/instants.service";
import { throwError } from "rxjs";
import { log } from "console";

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    @InjectRepository(Channel, 'core')
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message, 'core')
    private readonly messageRepository: Repository<Message>,
    private readonly channelService: ChannelService,
    private readonly instantsService: instantsService) { }

  @Query(() => [Channel])
  // @UseGuards(GqlAuthGuard)
  async findAllChannel(@Context('req') req): Promise<Channel[]> {
    const workspaceId = req.headers['x-workspace-id']
    return await this.channelService.findAllChannel(workspaceId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findMsgByChannelId(@Context('req') req, @Args('channelId') channelId: string): Promise<Message[] | Message> {
    const messages = await this.channelService.findMsgByChannelId(channelId);
    await this.channelService.makeUnseenSeen(messages);
    return messages
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Channel)
  async findExistingChannelByPhoneNo(@Context('req') req, @Args('memberIds') memberIds: string): Promise<Channel | undefined> {
    const workspaceId = req.headers['x-workspace-id']
    const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const senderId = Number(findTrueInstants?.phoneNumberId)
    const memberIdsJson = JSON.parse(memberIds)
    memberIdsJson.push(senderId)
    return await this.channelService.findExistingChannelByPhoneNo(JSON.parse(memberIds), workspaceId)
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findAllUnseen() {
    const unseenMessages = await this.channelService.findAllUnseen()
    return unseenMessages
  }



  @UseGuards(GqlAuthGuard)
  @Mutation(() => SendMessageResponse)
  async sendMessage(
    @Context('req') req,
    @Args('input') input: SendMessageInput,
  ): Promise<SendMessageResponse> {
    const { receiverId, textMessage, channelName, channelId, uploadedFiles } = input;
    const userId = req.user.userId;
    const workspaceId = req.headers['x-workspace-id']
    const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const senderId = Number(findTrueInstants?.phoneNumberId)
    const accessToken = findTrueInstants?.accessToken

    // Send WhatsApp message via Facebook Graph API
    // const response = await axios({
    //   url: `https://graph.facebook.com/v22.0/${senderId}/messages`,
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${findTrueInstants?.accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   data: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: receiverId[0], 
    //     type: 'text',
    //     text: {
    //       body: message,
    //     },
    //   }),
    // });




 if ((!uploadedFiles || uploadedFiles.length === 0) && textMessage) {
    // Send plain text message
    const messageType = 'text'
    await this.channelService.sendWhatsappMessage({
      accessToken,
      senderId,
      receiverId,
      messageType,
      textMessage,
      attachmentUrl: null,
    });

    // Save message to DB
    if (!channelId || channelId === '') {
      const memberIds = [...receiverId, senderId];
      const channel: any = await this.channelService.findOrCreateChannel(
        senderId,
        memberIds,
        workspaceId,
        channelName,
        userId,
      );
      if (!channel.channel.id) throw new Error('Channel not found');
      await this.channelService.createMessage(textMessage, channel.channel.id, senderId, workspaceId, true);
    } else {
      await this.channelService.createMessage(textMessage, channelId, senderId, workspaceId, true);
    }
  }

  //Handle uploaded files (with or without textMessage)
  if (uploadedFiles && uploadedFiles.length > 0) {
    for (const uploadedFile of uploadedFiles) {
      const attachmentUrl = uploadedFile.fileUrl;
      const messageType = await this.channelService.findMessageType(attachmentUrl);

      await this.channelService.sendWhatsappMessage({
        accessToken,
        senderId,
        receiverId,
        messageType,
        textMessage,
        attachmentUrl,
      });

      if (!channelId || channelId === '') {
        const memberIds = [...receiverId, senderId];
        const channel: any = await this.channelService.findOrCreateChannel(
          senderId,
          memberIds,
          workspaceId,
          channelName,
          userId,
        );
        if (!channel.channel.id) throw new Error('Channel not found');
        await this.channelService.createMessage(textMessage, channel.channel.id, senderId, workspaceId, true, attachmentUrl);
      } else {
        await this.channelService.createMessage(textMessage, channelId, senderId, workspaceId, true, attachmentUrl);
      }
    }
  }

    return { success: 'Message sent' };

  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async deleteChannelById(@Args('channelId') channelId: string): Promise<Channel | undefined> {
    return this.channelService.deleteChannelById(channelId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async updateChannelNameById(@Args('channelId') channelId: string, @Args('updatedValue') updatedValue: string): Promise<Channel> {
    return await this.channelService.updateChannelNameById(channelId, updatedValue)
  }


  // @Mutation(() => TemplateResponseDto)
  // async submitTemplate(
  //   @Args('template') template: TemplateRequestInput,
  // ): Promise<TemplateResponseDto> {
  //   const result = await this.channelService.submitTemplate(template);
  //   return {
  //     success: result.success,
  //     data: result.data ? JSON.stringify(result.data) : undefined,
  //     error: result.error ? JSON.stringify(result.error) : undefined,
  //   };
  // }

  // @Query(() => TemplateResponseDto)
  // async getTemplateStatus(
  //   @Args('templateId') templateId: string,
  // ): Promise<TemplateResponseDto> {
  //   const result = await this.channelService.getTemplateStatus(templateId);
  //   return {
  //     success: result.success,
  //     data: result.data ? JSON.stringify(result.data) : undefined,
  //     error: result.error ? JSON.stringify(result.error) : undefined,
  //   };
  // }


  // @Query(() => String)
  // async getAllTemplates(){
  // await this.channelService.getAllTemplates()
  // }

}

