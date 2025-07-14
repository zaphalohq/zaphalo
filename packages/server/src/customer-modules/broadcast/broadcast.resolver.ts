import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { BroadcastReqDto } from "./dto/BroadcastReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";

@Resolver(() => Broadcast)
export class BroadcastResolver {
    constructor(
        private readonly broadcastService: BroadcastService,
        private readonly waAccountService: WaAccountService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Broadcast])
    async findAllBroadcast(@Context('req') req) {
        const workspaceId = req.headers['x-workspace-id'];
        return await this.broadcastService.findAllBroadcast(workspaceId)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Broadcast)
    async BroadcastTemplate(@Args('broadcastData') broadcastData: BroadcastReqDto): Promise<Broadcast> {
        const findTrueInstants = await this.waAccountService.FindSelectedInstants()
        const accessToken = findTrueInstants?.accessToken
        const phoneNumberId = findTrueInstants?.phoneNumberId
        return await this.broadcastService.BroadcastTemplate(accessToken, broadcastData, phoneNumberId)
    }

}
