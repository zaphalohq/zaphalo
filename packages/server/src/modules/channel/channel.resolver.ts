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
// import { TemplateResponseDto } from "./dto/TemplateResponseDto";
// import { TemplateRequestInput } from "./dto/TemplateRequestInput";

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    @InjectRepository(Channel, 'core')
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message, 'core')
    private readonly messageRepository: Repository<Message>,
    private readonly channelService: ChannelService,
    private readonly instantsService: instantsService,
  ) { }


  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllChannel(@Context('req') req): Promise<Channel[]> {
    const workspaceIds = req.user.workspaceIds[0];
    return await this.channelService.findAllChannel(workspaceIds);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findMsgByChannelId(@Context('req') req, @Args('channelId') channelId: string): Promise<Message[] | Message> {
    console.log(channelId, "this is channelid");

    const messages = await this.channelService.findMsgByChannelId(channelId);
    await this.channelService.makeUnseenSeen(messages);
    return messages
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Channel)
  async findExistingChannelByPhoneNo(@Context('req') req, @Args('memberIds') memberIds: string): Promise<Channel | undefined> {
    const workspaceId = req.user.workspaceIds[0];
    console.log(workspaceId, "workspaceId.........................workspaceId");

    return await this.channelService.findExistingChannelByPhoneNo(JSON.parse(memberIds), workspaceId)
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findAllUnseen() {
    console.log("this if form unseeen form backend");
    const unseenMessages = await this.channelService.findAllUnseen()
    console.log(unseenMessages);

    return unseenMessages
  }



  @UseGuards(GqlAuthGuard)
  @Mutation(() => SendMessageResponse)
  async sendMessage(
    @Context('req') req,
    @Args('input') input: SendMessageInput,
  ): Promise<SendMessageResponse> {
    const { senderId, receiverId, message, channelName, channelId, attachment } = input;
    // console.log(input,senderId , 'senterid', receiverId, 'receiverId', message, 'msg', channelName ,'channelName', channelId,'channelId' ,"...........................input........................");
    const userId = req.user.userId;
    const workspaceId = req.user.workspaceIds[0];
    const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const senderId1 = Number(findTrueInstants?.phoneNumberId)
    // // Send WhatsApp message via Facebook Graph API
    // const response = await axios({
    //   url: `https://graph.facebook.com/v22.0/${senderId1}/messages`,
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${findTrueInstants?.accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   data: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: receiverId[0], // Assuming first receiverId is the target
    //     type: 'text',
    //     text: {
    //       body: message,
    //     },
    //   }),
    // });

    // console.log(response);



    if (channelId == "") {
      const memberIds = [...receiverId, senderId1]; // Combine sender and receivers
      const channel: any = await this.channelService.findOrCreateChannel(
        senderId1,
        memberIds,
        workspaceId,
        channelName,
        userId,
      );

      if (!channel.channel.id) {
        throw new Error('Channel not found');
      }
      console.log(channel.channel.id, "channelIdchannelIdchannelIdchannelIdchannelIdchannelIdchannelIdchannelId..........................");

      await this.channelService.createMessage(message, channel.channel.id, senderId1, workspaceId, true, attachment);
      return { message: 'Message sent' };
    } else {
      if (channelId && channelId !== "")
        await this.channelService.createMessage(message, channelId, senderId1, workspaceId, true, attachment);
      return { message: 'Message sent' };
    }

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

