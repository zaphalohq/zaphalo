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
    const contact = await this.contactService.findActiveContactOrCreate(phoneNo, phoneNo)
    const channelName = contact?.contactName;
    return await this.channelService.findActiveChannelOrCreate(phoneNo, channelName)
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

