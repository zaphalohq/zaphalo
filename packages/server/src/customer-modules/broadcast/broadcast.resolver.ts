import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { BroadcastReqDto } from "./dto/BroadcastReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { instantsService } from "src/customer-modules/instants/instants.service";

@Resolver(() => Broadcast)
export class BroadcastResolver {
    constructor(
        private readonly broadcastService: BroadcastService,
        private readonly instantsService: instantsService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Broadcast])
    async findAllBroadcast(@Context('req') req) {
        const workspaceId = req.headers['x-workspace-id'];
        return await this.broadcastService.findAllBroadcast(workspaceId)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Broadcast)
    async BroadcastTemplate(@Context('req') req, @Args('broadcastData') broadcastData: BroadcastReqDto): Promise<Broadcast> {
        const workspaceId = req.headers['x-workspace-id']
        const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
        const accessToken = findTrueInstants?.accessToken
        const phoneNumberId = findTrueInstants?.phoneNumberId
        return await this.broadcastService.BroadcastTemplate(workspaceId, accessToken, broadcastData, phoneNumberId)
    }
}
