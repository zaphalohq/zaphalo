import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Channel } from "./channel.entity";
import axios from "axios";
import { ChannelService } from "./channel.service";
import { Message } from "./message.entity";
import { UseGuards } from "@nestjs/common";
import { SendMessageInput, SendMessageResponse } from "./dto/SendMessageInputDto";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { ContactsService } from "src/customer-modules/contacts/contacts.service";

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly channelService: ChannelService,
    private readonly contactService: ContactsService,
    private readonly waAccountService: WaAccountService) { }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllChannel(
    @Context('req') req): Promise<Channel[]> {
    return await this.channelService.findAllChannel();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async findMsgByChannelId(@Context('req') req, @Args('channelId') channelId: string): Promise<Message[] | Message> {
    const messages = await this.channelService.findMsgByChannelId(channelId);
    await this.channelService.makeUnseenSeen(messages);
    return messages
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async findExistingChannelByPhoneNoOrCreateChannel(@Args('phoneNo') phoneNo: string): Promise<Channel | undefined> {
    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    const contact = await this.contactService.findOneContact(Number(phoneNo))
    const senderId = Number(findTrueInstants?.phoneNumberId)
    const channelName = contact?.contactName;
    const memberIds = [Number(phoneNo), senderId]
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const existingChannel = await this.channelService.findExistingChannelByPhoneNo(memberIds)
    if (existingChannel && existingChannel?.id){
      return existingChannel
    }else{
      const createdChannel =   await this.channelService.findOrCreateChannel(
        senderId,
        memberIds,
        channelName,
      );
      return createdChannel.channel
    }
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

    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const senderId = Number(findTrueInstants?.phoneNumberId)
    const accessToken = findTrueInstants?.accessToken
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
    //       body: textMessage,
    //     },
    //   }),
    // });


    const receiverId1 = receiverId.filter((number: any) => number != senderId)
    console.log(input,'receiverId1...............');
    
    if ((!uploadedFiles || uploadedFiles.length === 0) && textMessage) {
      const messageType = 'text'
      await this.channelService.sendWhatsappMessage({
        accessToken,
        senderId,
        receiverId: receiverId1,
        messageType,
        textMessage,
        attachmentUrl: null,
      });

      if (!channelId || channelId === '') {
        const memberIds = [...receiverId, senderId];
        const channel: any = await this.channelService.findOrCreateChannel(
          senderId,
          memberIds,
          channelName,
        );
        if (!channel.channel.id) throw new Error('Channel not found');
        await this.channelService.createMessage(textMessage, channel.channel.id, senderId, true);
      } else {
        await this.channelService.createMessage(textMessage, channelId, senderId, true);
      }
    }

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
            channelName,
          );
          if (!channel.channel.id) throw new Error('Channel not found');
          await this.channelService.createMessage(textMessage, channel.channel.id, senderId, true, attachmentUrl);
        } else {
          await this.channelService.createMessage(textMessage, channelId, senderId, true, attachmentUrl);
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

}

