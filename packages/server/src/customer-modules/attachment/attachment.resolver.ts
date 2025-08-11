import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Attachment } from "./attachment.entity";
import { AttachmentService } from "./attachment.service";
import { CreateAttachmentDto } from "./dto/createAttachmentDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";

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

    @UseGuards(GqlAuthGuard)
    @Mutation(() => SuccessResponse)
    async DeleteOneAttachment(
        @Context() context: { req: Request },
        @Args('attachmentId') attachmentId: string)
        : Promise<SuccessResponse | undefined> {
        
        const workspaceId = context.req.headers['x-workspace-id'];
        await this.attachmentService.deleteOneAttachmentById(attachmentId, workspaceId);
        return {
            success: true,
            message: 'attachment deleted successfully'
        }
    }

}
