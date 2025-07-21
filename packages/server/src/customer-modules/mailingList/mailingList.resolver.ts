import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingListService } from "./mailingList.service";
import { MailingContact } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";
import { MailingContactResDto } from "./DTO/MailingContactResDto";
import { MailingContacts } from "./mailingContacts.entity";

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
  async findAllMailingContactByMailingListId(@Args('mailingListId') mailingListId : string) : Promise<MailingContacts[] | null> {
    console.log("...........................contac data");
    
    return await this.mailingListService.findAllMailingContactByMailingListId(mailingListId);
  }


  @Mutation(() => SuccessResponse)
  async saveMailingContact(@Args('saveMailingContact') saveMailingContact : MailingContact) {
    await this.mailingListService.saveMailingContact(saveMailingContact)
    return { success : 'contact saved successfully'}
  }

  @Mutation(() => SuccessResponse)
  async deleteMailingContact(@Args('mailingContactId') mailingContactId: string ) {
    const deleteContact = await this.mailingListService.deleteMailingContact(mailingContactId)
    console.log(deleteContact,'deletecontact');
    
    if(deleteContact.raw){

    }
    return { success : 'The contact deleted successfully'}
  }


}

