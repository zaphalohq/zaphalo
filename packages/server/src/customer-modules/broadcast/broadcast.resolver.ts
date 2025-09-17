import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Broadcast } from "./broadcast.entity";
import { BroadcastService } from "./broadcast.service";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SearchedRes } from "../whatsapp/dtos/searched.dto";

import { BroadcastResponse } from "src/customer-modules/broadcast/dto/broadcast-response.dto";
import { BroadcastRequest } from "src/customer-modules/broadcast/dto/brodcast-request-dto";
import { ManyBrodcastsResponse } from "src/customer-modules/broadcast/dto/many-brodcast-response.dto";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";


@Resolver(() => Broadcast)
export class BroadcastResolver {
  constructor(
    private readonly broadcastService: BroadcastService,
  ) {}

  @Query(() => Broadcast)
  async readBroadcast(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    ): Promise<Broadcast[] | null> {
    return this.broadcastService.readBroadcast(search, limit);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ManyBrodcastsResponse)
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BroadcastResponse)
  async saveBroadcast(
    @AuthWorkspace() workspace: Workspace,
    @Args('broadcastData') broadcastData: BroadcastRequest
  ): Promise<BroadcastResponse> {
    if (broadcastData.broadcastId){
      return await this.broadcastService.saveBroadcast(workspace.id, broadcastData);
    }else{
      return await this.broadcastService.createBroadcast(workspace.id, broadcastData);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => BroadcastResponse)
  async getBroadcast(
    @Args('broadcastId') broadcastId: string
  ): Promise<BroadcastResponse> {
    const response = await this.broadcastService.getBroadcast(broadcastId);
    return response
  }
}
