import { Args, Query, Resolver } from "@nestjs/graphql";
import { Channel } from "./channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelService } from "./channel.service";
import { Message } from "./message.entity";

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
    async findAllChannel(): Promise<Channel[]> {
        console.log("Fetching all channels...");
        return await this.channelService.findAllChannel();
    }

    @Query(() => [Message])
    async findMsgByChannelId(@Args('channelId') channelId : string ) : Promise<Message[] | Message> {
        return await this.channelService.findMsgByChannelId(channelId);
    }

    @Query(() => Channel) 
    async findExistingChannelByPhoneNo(@Args('memberIds') memberIds : string) : Promise<Channel | undefined> {
        return await this.channelService.findExistingChannelByPhoneNo(JSON.parse(memberIds))
    }
}
