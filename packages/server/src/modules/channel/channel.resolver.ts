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

@Resolver(() => Channel)
export class ChannelResolver {
    constructor(
        @InjectRepository(Channel, 'core')
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private readonly messageRepository: Repository<Message>,
        private readonly channelService: ChannelService,
    ) { }

    
    @Query(() => [Channel])
    @UseGuards(GqlAuthGuard)
    async findAllChannel(@Context('req') req): Promise<Channel[]> {
        const workspaceIds = req.user.workspaceIds[0];
        return await this.channelService.findAllChannel(workspaceIds);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Message])
    async findMsgByChannelId(@Context('req') req,@Args('channelId') channelId : string ) : Promise<Message[] | Message> {
        console.log(channelId,"this is channelid");
        const workspaceId = req.user.workspaceIds[0];
        const messages = await this.channelService.findMsgByChannelId(channelId);        
        await this.channelService.makeUnseenSeen(messages); 
        return messages
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Channel) 
    async findExistingChannelByPhoneNo(@Context('req') req, @Args('memberIds') memberIds : string) : Promise<Channel | undefined> {
      const workspaceId = req.user.workspaceIds[0];
      console.log(workspaceId,"workspaceId.........................workspaceId");
      
        return await this.channelService.findExistingChannelByPhoneNo(JSON.parse(memberIds), workspaceId)
    }


    @UseGuards(GqlAuthGuard)
    @Query(() => [Message])
    async findAllUnseen(){
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

    // // Send WhatsApp message via Facebook Graph API
    // const response = await axios({
    //   url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${process.env.Whatsapp_Token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   data: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: receiverId[0], // Assuming first receiverId is the target
    //     type: 'text',
    //     text: {
    //       body: msg,
    //     },
    //   }),
    // });

    // console.log(response.data); // Log the API response

    // Handle channel and message creation
    const userId = req.user.userId;
    const workspaceId = req.user.workspaceIds[0];
    console.log(workspaceId,"........................................................................");
    
    if (channelId == "") {
      const memberIds = [...receiverId, senderId]; // Combine sender and receivers
      const channel : any = await this.channelService.findOrCreateChannel(
        senderId,
        memberIds,
        workspaceId,
        channelName,
        userId,
      );

      if (!channel.channel.id) {
        throw new Error('Channel not found');
      }
      console.log(channel.channel.id,"channelIdchannelIdchannelIdchannelIdchannelIdchannelIdchannelIdchannelId..........................");
      
      await this.channelService.createMessage(message, channel.channel.id, senderId, workspaceId, true, attachment);
      return { message: 'Message sent' };
    } else {
      if(channelId && channelId !== "")
        await this.channelService.createMessage(message, channelId, senderId, workspaceId, true, attachment);
      return { message: 'Message sent' };
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async deleteChannelById(@Args('channelId') channelId : string) : Promise<Channel | undefined> {
    return this.channelService.deleteChannelById(channelId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async updateChannelNameById(@Args('channelId') channelId : string, @Args('updatedValue') updatedValue : string) : Promise<Channel> {
    return await this.channelService.updateChannelNameById(channelId,updatedValue)
  }

}
