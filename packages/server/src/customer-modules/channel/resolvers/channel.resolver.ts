import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { ContactsService } from "src/customer-modules/contacts/contacts.service";
import { FileService } from "src/modules/file-storage/services/file.service";
import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { ChannelService } from "src/customer-modules/channel/services/channel.service";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { Message } from "../entities/message.entity";

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly channelService: ChannelService,
    private readonly contactService: ContactsService,
    private readonly waAccountService: WaAccountService,
    private fileService: FileService
  ) { }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllChannel(
    @Context('req') req): Promise<Channel[]> {
    return await this.channelService.findAllChannel();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Channel)
  async findExistingChannelByPhoneNoOrCreateChannel(@Args('phoneNo') phoneNo: string): Promise<Channel | undefined> {
<<<<<<< HEAD
    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    const contact = await this.contactService.findOneContact(phoneNo)
    const senderId = findTrueInstants?.phoneNumberId
    const channelName = contact?.contactName;
    const memberIds = [phoneNo, senderId]
    if (!findTrueInstants) throw new Error('findTrueInstants not found');
    const existingChannel = await this.channelService.findExistingChannelByPhoneNo(memberIds)
    if (existingChannel && existingChannel?.id) {
      return existingChannel
    } else {
      const createdChannel = await this.channelService.findOrCreateChannel(
        senderId,
        memberIds,
        channelName,
      );
      return createdChannel.channel
    }
=======
    const contact = await this.contactService.findActiveContactOrCreate(phoneNo, phoneNo)
    const channelName = contact?.contactName;
    return await this.channelService.findActiveChannelOrCreate(phoneNo, channelName)
>>>>>>> 7b2a38b9e6872dda294d74b579f41ef68b9e388c
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

  @ResolveField(() => Message, { nullable: true })
  async lastMsgOfChannle(@Parent() channel: Channel): Promise<Message | null> {
    return await this.channelService.findLastMsgOfChannel(channel.id);
  }
}

