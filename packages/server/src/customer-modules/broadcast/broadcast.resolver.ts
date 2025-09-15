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

  @Query(() => Broadcast)
  async readBroadcast(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    ): Promise<Broadcast[] | null> {
    return this.broadcastService.readBroadcast(search, limit);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => FindAllBrodcastRes)
  async searchReadBroadcast(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
  ) {
    if(!search)
      search = ''
    if(!filter)
      filter = ''
    const response = await this.broadcastService.searchReadBroadcast(page, pageSize, search, filter)
    return response
  }

}
