import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { MailingList } from "./mailingList.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MailingListService } from "./mailingList.service";
import { Request, UseGuards } from "@nestjs/common";
import { MailingListInputDto } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    private readonly mailingListService: MailingListService,
  ) { }

  @Mutation(() => MailingList)
  @UseGuards(GqlAuthGuard)
  async CreateMailingList(@Context('req') req,@Args('mailingListInput') mailingListInput : MailingListInputDto ): Promise<MailingList> {
    const workspaceId = req.headers['x-workspace-id']
    console.log(mailingListInput,"mailingListInputmailingListInputmailingListInput");
    
    return this.mailingListService.CreateMailingList(mailingListInput, workspaceId)
  }

   @Query(() => [MailingList])
  @UseGuards(GqlAuthGuard)
  async findAllMailingList(@Context('req') req): Promise<MailingList[]> {
    const workspaceId = req.headers['x-workspace-id']
    return this.mailingListService.findAllMailingList(workspaceId)
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => MailingList)
  // async CreateMailingList(@Args('channelId') channelId: string, @Args('updatedValue') updatedValue: string): Promise<MailingList> {
  //   return await this.channelService.updateChannelNameById(channelId, updatedValue)
  // }

}

