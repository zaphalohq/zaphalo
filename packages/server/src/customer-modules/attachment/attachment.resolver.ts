import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Attachment } from "./attachment.entity";
import { AttachmentService } from "./attachment.service";
import { CreateAttachmentDto } from "./dto/createAttachmentDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => Attachment)
export class AttachmentResolver {
    constructor(
        private readonly attachmentService: AttachmentService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Attachment)
    async CreateOneAttachment(@Args('Attachment') createAttachmentDto: CreateAttachmentDto): Promise<Attachment | undefined> {
        return await this.attachmentService.createOneAttachment(createAttachmentDto)
    }

    // @UseGuards(GqlAuthGuard)
    // @Query(() => [Contacts])
    // async findAllContacts() {
    //     return await this.contactsservice.findAllContacts()
    // }

    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => Contacts)
    // async DeleteContact(@Args('contactId') contactId: string) {
    //     return this.contactsservice.DeleteContact(contactId)
    // }
}
