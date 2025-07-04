import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { createContactsDto } from "./dto/createContactsDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => Contacts)
export class contactsResolver {
    constructor(
        private readonly contactsservice: ContactsService
    ) { }

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
    @Mutation(() => Contacts)
    async DeleteContact(@Args('contactId') contactId: string) {
        return this.contactsservice.DeleteContact(contactId)
    }
}
