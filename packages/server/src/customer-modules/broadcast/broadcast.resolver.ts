import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { BroadcastReqDto } from "./dto/BroadcastReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";


@Resolver(() => Broadcast)
export class BroadcastResolver {
    constructor(
        private readonly broadcastService: BroadcastService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Broadcast])
    async findAllBroadcast() {
        return await this.broadcastService.findAllBroadcast()
    }


    @UseGuards(GqlAuthGuard)
    @Mutation(() => Broadcast)
    async BroadcastTemplate(@Args('broadcastData') broadcastData: BroadcastReqDto): Promise<Broadcast> {

        const saveTemplates = await this.broadcastService.saveBroadcast(broadcastData);
        console.log(saveTemplates,'savetemplate....');
        
        // if (saveTemplates) this.broadcastService.cronForPendingBroadcasts();



        return saveTemplates
    }

}
