import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Contacts } from "./contacts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactsService } from "./contacts.service";
import { createContactsDto } from "./dto/createContactsDto";
import { Repository } from "typeorm";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => Contacts)
export class contactsResolver {
    constructor(
        private readonly contactsservice: ContactsService

    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async CreateContacts(@Context('req') req, @Args('CreateContacts') CreateContacts: createContactsDto): Promise<Contacts | undefined> {
        console.log(CreateContacts,'.....................createcontacts ..............');
        
        const workspaceId = req.headers['x-workspace-id']
        console.log(workspaceId);
        
        return await this.contactsservice.createContacts(CreateContacts, workspaceId)
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Contacts])
    async findAllContacts(@Context('req') req) {
        const workspaceId = req.headers['x-workspace-id']; 
        return await this.contactsservice.findAllContacts(workspaceId)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async DeleteContact(@Args('contactId') contactId: string) {
        return this.contactsservice.DeleteContact(contactId)
    }
}
