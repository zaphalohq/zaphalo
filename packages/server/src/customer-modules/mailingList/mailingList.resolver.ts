import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingListService } from "./mailingList.service";
import { MailingContact } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";
import { MailingContactResDto } from "./DTO/MailingContactResDto";
import { MailingContacts } from "./mailingContacts.entity";
import { SearchAndPaginateContactResDto, SelectedMailingContactResDto } from "./DTO/SelectedMailingContactResDto";

@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    private readonly mailingListService: MailingListService,
  ) { }


  @Query(() => [MailingList])
  @UseGuards(GqlAuthGuard)
  async findAllMailingList(): Promise<MailingList[]> {
    return this.mailingListService.findAllMailingList()
  }

  @Query(() => [MailingContacts])
  async findAllMailingContactByMailingListId(@Args('mailingListId') mailingListId: string): Promise<MailingContacts[] | null> {
    return await this.mailingListService.findAllMailingContactByMailingListId(mailingListId);
  }


  @Mutation(() => SuccessResponse)
  async saveMailingContact(@Args('saveMailingContact') saveMailingContact: MailingContact) {
    await this.mailingListService.saveMailingContact(saveMailingContact)
    return {
      success: true,
      message: 'contact saved successfully'
    }
  }

  @Mutation(() => SuccessResponse)
  async deleteMailingContact(@Args('mailingContactId') mailingContactId: string) {
    const deleteContact = await this.mailingListService.deleteMailingContact(mailingContactId)
    console.log(deleteContact, 'deletecontact');

    // if(deleteContact.raw){

    // }
    return {
      success: true,
      message: 'Mailing Contact Deleted successfully'
    }
  }

  @Query(() => SelectedMailingContactResDto)
  async selectedMailingContact(
    @Args('mailingListId') mailingListId: string,
    @Args('currentPage', { type: () => Int }) currentPage: number,
    @Args('itemsPerPage', { type: () => Int }) itemsPerPage: number
  ): Promise<SelectedMailingContactResDto | null> {
    return await this.mailingListService.selectedMailingContact(mailingListId, currentPage, itemsPerPage);
  }

  @Query(() => SearchAndPaginateContactResDto)
  async searchAndPaginateContact(
    @Args('mailingListId') mailingListId: string,
    @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
  ): Promise<SearchAndPaginateContactResDto | null> {
    return this.mailingListService.searchAndPaginateContact(mailingListId, searchTerm);
  }


}

