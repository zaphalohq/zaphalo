import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UseGuards } from "@nestjs/common";
import { TemplateResponseDto } from "./dto/TemplateResponseDto";
import { TemplateRequestInput } from "./dto/TemplateRequestInputDto";
import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
import { instantsService } from "../instants/instants.service";
import { TemplateWhatsappReq } from "./dto/TemplateWhatsappReq";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";

@Resolver(() => Template)
export class TemplateResolver {
    constructor(
        private readonly templateService: TemplateService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TemplateResponseDto)
    async submitTemplate(
        @Context('req') req, @Args('templateData') templateData: TemplateRequestInput,
    ): Promise<TemplateResponseDto> {
        const workspaceId = req.headers['x-workspace-id']
        const result = await this.templateService.submitTemplate(templateData, workspaceId);
        console.log(result, "resultresultresultresultresultresultresult");

        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };
        // console.log(templateData,"etetetetettete....................");

        // return {
        //     success: true,
        //     data: "result.data ? JSON.stringify(result.data) : undefined",
        //     error: "result.error ? JSON.stringify(result.error) : undefined",
        // };


    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TemplateResponseDto)
    async getTemplateStatus(
        @Context('req') req,
        @Args('templateId') templateId: string,
    ): Promise<TemplateResponseDto> {
        const workspaceId = req.headers['x-workspace-id']
        const result = await this.templateService.getTemplateStatusByCron(templateId, workspaceId);
        if (!result) throw new Error("result doesnt found in resolver templateResolver")

        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };


    }

    @Query(() => String)
    async getAllTemplatesFromApi() {
        await this.templateService.getAllTemplates()
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Template])
    async findAllTemplate(@Context('req') req): Promise<Template[]> {
        const workspaceId = req.headers['x-workspace-id']
        return await this.templateService.findAllTemplate(workspaceId)
    }

    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => String)
    // async sendTemplateToWhatssapp(@Context('req') req, @Args('broadcastData') broadcastData : TemplateWhatsappReq): Promise<string> {
    //     const workspaceId = req.headers['x-workspace-id']
    //     const findTrueInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    //     const accessToken = findTrueInstants?.accessToken
        
    //     await this.templateService.sendTemplateToWhatssapp(accessToken, broadcastData)
    //     return "worked......."
    // }


    //     @Mutation(() => String)
    //     async uploadFileToWhatsApp(@Args('file', { type: () => GraphQLUpload }) file: FileUpload): Promise<string> {
    //       if (!file.mimetype.startsWith('image/') || !['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    //         throw new Error('Please upload a PNG or JPG image.');
    //       }

    //       // Note: WhatsApp has a 5MB file size limit for images.
    //       // FileUpload streams don't provide size directly. To validate size:
    //       // 1. Use middleware like graphqlUploadExpress with maxFileSize option (preferred).
    //       // 2. Or read the stream to calculate size (less efficient, requires buffering).
    //       // For now, rely on client-side validation (frontend checks file size < 5MB).
    //       // Example middleware setup in main.ts:
    //       // app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }));
    //   console.log(file);

    //       return this.templateService.uploadFile(file);
    //     }

}

