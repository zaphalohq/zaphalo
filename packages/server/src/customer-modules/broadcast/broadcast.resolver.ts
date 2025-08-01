import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { BroadcastReqDto } from "./dto/BroadcastReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";
import { SearchedRes } from "../whatsapp/dtos/searched.dto";
import { FindAllBrodcastRes } from "./dto/FindAllBrodcastRes";


@Resolver(() => Broadcast)
export class BroadcastResolver {
    constructor(
        private readonly broadcastService: BroadcastService,
    ) {
    }


    @UseGuards(GqlAuthGuard)
    @Query(() => FindAllBrodcastRes)
    async findAllBroadcast(
        @Args('currentPage', { type: () => Int }) currentPage: number,
        @Args('itemsPerPage', { type: () => Int }) itemsPerPage: number) {
        return await this.broadcastService.findAllBroadcast(currentPage, itemsPerPage)
    }


    @UseGuards(GqlAuthGuard)
    @Mutation(() => SuccessResponse)
    async BroadcastTemplate(@Args('broadcastData') broadcastData: BroadcastReqDto): Promise<SuccessResponse> {
        const saveTemplates = await this.broadcastService.saveBroadcast(broadcastData);
        if (saveTemplates) {
            this.broadcastService.sendMessagesInBackground();
        }
        return {
            success: true,
            message: 'Broadcast save successfully and broadcast sending started.'
        }
    }

    
      @Query(() => SearchedRes)
      async searchBroadcast(
        @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
      ): Promise<SearchedRes | null> {
        return this.broadcastService.searchBroadcast(searchTerm);
      }

}
