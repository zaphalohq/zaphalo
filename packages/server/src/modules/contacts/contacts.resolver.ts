import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Contacts } from "./contacts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { contactsService } from "./contacts.service";
import { createContactsDto } from "./dto/createContactsDto";
import { Repository } from "typeorm";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";

@Resolver(() => Contacts)
export class contactsResolver {
    constructor(
            @InjectRepository(Contacts, 'core')
            private readonly contactsRepository: Repository<Contacts>,
            private readonly contactsservice: contactsService,
        ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Contacts)
    async CreateContacts (@Context('req') req,@Args('CreateContacts') CreateContacts: createContactsDto): Promise<Contacts | undefined> {
        const userId = req.user.userId
        // console.log();
        
        return await this.contactsservice.createContacts(CreateContacts)
    }

    @Query(() => [Contacts])
    async findAllContacts(){
        return await this.contactsservice.findAllContacts()
    }
}