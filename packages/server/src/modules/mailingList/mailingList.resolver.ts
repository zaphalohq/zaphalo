import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { MailingList } from "./mailingList.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MailingListService } from "./mailingList.service";
import { Request, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import axios from 'axios'
import { instantsService } from "../whatsapp/instants.service";
import { throwError } from "rxjs";
import { log } from "console";
import { MailingListInputDto } from "./DTO/MailingListReqDto";

@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    @InjectRepository(MailingList, 'core')
    private readonly mailingListRepository: Repository<MailingList>,
    private readonly mailingListService: MailingListService,
  ) { }

  @Mutation(() => MailingList)
  // @UseGuards(GqlAuthGuard)
  async CreateMailingList(@Context('req') req,@Args('mailingListInput') mailingListInput : MailingListInputDto ): Promise<MailingList> {
    const workspaceId = req.headers['x-workspace-id']
    console.log(mailingListInput,"mailingListInputmailingListInputmailingListInput");
    
    return this.mailingListService.CreateMailingList(mailingListInput, workspaceId)
  }

   @Query(() => [MailingList])
  // @UseGuards(GqlAuthGuard)
  async findAllMailingList(@Context('req') req): Promise<MailingList[]> {
    // const workspaceId = req.headers['x-workspace-id']
    console.log(".................................");
    
    const workspaceId = "72407694-250e-4c9e-b1aa-480f0afbeb99"
    return this.mailingListService.findAllMailingList(workspaceId)
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => MailingList)
  // async CreateMailingList(@Args('channelId') channelId: string, @Args('updatedValue') updatedValue: string): Promise<MailingList> {
  //   return await this.channelService.updateChannelNameById(channelId, updatedValue)
  // }

}

