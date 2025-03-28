import { Args, Query, Resolver } from "@nestjs/graphql";
import { Channel } from "./channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelService } from "./channel.service";
import { Message } from "./message.entity";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";

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
    async findAllChannel(): Promise<Channel[]> {
        // console.log("Fetching all channels...");
        return await this.channelService.findAllChannel();
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Message])
    async findMsgByChannelId(@Args('channelId') channelId : string ) : Promise<Message[] | Message> {
        const messages = await this.channelService.findMsgByChannelId(channelId);        
        return messages
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Channel) 
    async findExistingChannelByPhoneNo(@Args('memberIds') memberIds : string) : Promise<Channel | undefined> {
        return await this.channelService.findExistingChannelByPhoneNo(JSON.parse(memberIds))
    }

    // @UseGuards(GqlAuthGuard)
    @Query(() => [Message])
    async findAllUnseen(){
        console.log("this if form unseeen form backend");
        const unseenMessages = await this.channelService.findAllUnseen()
        console.log(unseenMessages);
        
        return unseenMessages
    }
}
