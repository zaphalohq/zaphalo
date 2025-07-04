import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingListService } from "./mailingList.service";
import { MailingListInputDto } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    private readonly mailingListService: MailingListService,
  ) { }

  @Mutation(() => MailingList)
  @UseGuards(GqlAuthGuard)
  async CreateMailingList(@Args('mailingListInput') mailingListInput : MailingListInputDto ): Promise<MailingList> {
    return this.mailingListService.CreateMailingList(mailingListInput)
  }

   @Query(() => [MailingList])
  @UseGuards(GqlAuthGuard)
  async findAllMailingList(): Promise<MailingList[]> {
    return this.mailingListService.findAllMailingList()
  }
}

