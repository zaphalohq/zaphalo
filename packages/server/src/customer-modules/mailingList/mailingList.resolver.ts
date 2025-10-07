import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingListService } from "./mailingList.service";
import { MailingContact } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";
import { MailingContacts } from "./mailingContacts.entity";
import { SelectedMailingContactResDto } from "./DTO/SelectedMailingContactResDto";
import { FindAllMailingListRes } from "./DTO/FindAllMailingListDto";
import { SearchedRes } from "../whatsapp/dtos/searched.dto";
import { MailingContactResDto } from "./DTO/MailingContactResDto";

@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    private readonly mailingListService: MailingListService,
  ) { }


  @Query(() => FindAllMailingListRes)
  @UseGuards(GqlAuthGuard)
  async searchReadMailingList(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
  ): Promise<FindAllMailingListRes> {
    if (!search)
      search = ''
    if (!filter)
      filter = ''

    const response = await this.mailingListService.searchReadMailingList(page, pageSize, search, filter)
    return response
  }

  @Query(() => SelectedMailingContactResDto)
  @UseGuards(GqlAuthGuard)
  async findAllMailingContacts(
    @Args('mailingListId') mailingListId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ): Promise<SelectedMailingContactResDto> {
    if (!search)
      search = ''
    return await this.mailingListService.findAllContactsOfMailingList(mailingListId, page, pageSize, search);
  }

  @Query(() => MailingContacts, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async findMailingContact(
    @Args('mailingContactId') mailingContactId: string,
  ): Promise<MailingContacts | null> {
    return await this.mailingListService.findMailingContactByContactId(mailingContactId)
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async saveMailingContact(@Args('saveMailingContact') saveMailingContact: MailingContact) {
    await this.mailingListService.saveMailingContact(saveMailingContact)
    return {
      success: true,
      message: 'contact saved successfully'
    }
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async deleteMailingListWithAllContacts(@Args('mailingId') mailingListId: string) {
    return this.mailingListService.deleteMailingWithContacts(mailingListId)
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async deleteMailingContact(@Args('mailingContactId') mailingContactId: string) {
    const deleteContact = await this.mailingListService.deleteMailingContact(mailingContactId)

    return {
      success: true,
      message: 'Mailing Contact Deleted successfully'
    }
  }

  @Query(() => SearchedRes)
  async searchMailingList(
    @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
  ): Promise<SearchedRes | null> {
    return this.mailingListService.searchMailingList(searchTerm);
  }

  @Query(() => [MailingList])
  async readMailingList(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<MailingList[] | undefined> {
    const mailigList = await this.mailingListService.readMailingList(search, limit);
    return mailigList
  }

}

