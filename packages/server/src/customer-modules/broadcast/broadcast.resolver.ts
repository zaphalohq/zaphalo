import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { BroadcastReqDto } from "./dto/BroadcastReqDto";
import { instantsService } from "src/customer-modules/instants/instants.service";

@Resolver(() => Broadcast)
export class BroadcastResolver {
    constructor(
        // @InjectRepository(Broadcast, 'core')
        // private readonly contactsRepository: Repository<Broadcast>,
        private readonly broadcastService: BroadcastService,
        private readonly instantsService: instantsService

    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Broadcast])
    async findAllBroadcast(@Context('req') req) {
        const workspaceId = req.headers['x-workspace-id']; 
        console.log(workspaceId,"worspacid...................................");
        
        return await this.broadcastService.findAllBroadcast(workspaceId)
    }

   @UseGuards(GqlAuthGuard)
    @Mutation(() => Broadcast)
    async BroadcastTemplate(@Context('req') req, @Args('broadcastData') broadcastData : BroadcastReqDto): Promise<Broadcast> {
        const workspaceId = req.headers['x-workspace-id']
        const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
        const accessToken = findTrueInstants?.accessToken
        const phoneNumberId = findTrueInstants?.phoneNumberId
        console.log('this is broadcast resolver');
        
        return await this.broadcastService.BroadcastTemplate(workspaceId, accessToken, broadcastData, phoneNumberId)
    }
}
