import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Int } from "@nestjs/graphql";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { createContactsDto } from "./dto/createContactsDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { updateContactsDto } from "./dto/updateContactsDto";
import { ManyContactResponse } from "./dto/many-contact-response.dto";

@Resolver(() => Contacts)
export class ContactsResolver {
    constructor(
        private readonly contactsservice: ContactsService
    ) {}

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async CreateContacts(@Args('CreateContacts') CreateContacts: createContactsDto): Promise<Contacts | undefined> {
        return await this.contactsservice.createContacts(CreateContacts)
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
        @Args('search', { type: () => String, nullable: true}) search?: string,
        @Args('filter', { type: () => String, nullable: true}) filter?: string,
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
    async getContactById(@Args('contactId') contactId: string){
        return await this.contactsservice.getContactbyId(contactId)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async UpdateContact(@Args('UpdateContact') UpdateContact: updateContactsDto): Promise<updateContactsDto | undefined> {
        return await this.contactsservice.UpdateContact(UpdateContact)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async DeleteContact(@Args('contactId') contactId: string) {
        return this.contactsservice.DeleteContact(contactId)
    }
}
