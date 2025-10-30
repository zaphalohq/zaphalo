import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Int } from "@nestjs/graphql";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { createContactsDto } from "./dto/createContactsDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { updateContactsDto } from "./dto/updateContactsDto";
import { ManyContactResponse } from "./dto/many-contact-response.dto";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { ContactResponse } from "./dto/contact-response.dto";

@Resolver(() => Contacts)
export class ContactsResolver {
    constructor(
        private readonly contactsservice: ContactsService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async CreateContacts(@Args('CreateContacts') CreateContacts: createContactsDto): Promise<Contacts | undefined> {
        return await this.contactsservice.createContacts(CreateContacts)
    }

    // @UseGuards(GqlAuthGuard)
    @Mutation(() => [Contacts])
    async CreateContactss(
        @Args('CreateContacts') CreateContacts: createContactsDto,
    ): Promise<Contacts[]> {
        return await this.contactsservice.createContactss(CreateContacts);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Contacts])
    async findAllContacts() {
        return await this.contactsservice.findAllContacts()
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => ManyContactResponse)
    async searchReadContacts(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
        @Args('search', { type: () => String, nullable: true }) search?: string,
        @Args('filter', { type: () => String, nullable: true }) filter?: string,
    ) {
        if (!search)
            search = ''
        if (!filter)
            filter = ''
        const response = await this.contactsservice.searchReadContacts(search, filter, page, pageSize)
        return response
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Contacts)
    async getContactById(@Args('contactId') contactId: string) {
        return await this.contactsservice.getContactbyId(contactId)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async UpdateContact(
        @AuthWorkspace() workspace: Workspace,
        @Args('UpdateContact') UpdateContact: updateContactsDto): Promise<updateContactsDto | undefined> {
        return await this.contactsservice.UpdateContact(workspace, UpdateContact)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ContactResponse)
    async DeleteContact(@Args('ContactIds', { type: () => [String] }) ContactIds: string[]) {
        return this.contactsservice.DeleteContact(ContactIds)
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Contacts)
    async findContactByChannleId(@Args('channelId') channelId: string) {
        return await this.contactsservice.findContactByChannleId(channelId)
    }
}
