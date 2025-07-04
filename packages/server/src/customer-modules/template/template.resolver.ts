import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { TemplateResponseDto } from "./dto/TemplateResponseDto";
import { TemplateRequestInput } from "./dto/TemplateRequestInputDto";
import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
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
        const result = await this.templateService.submitTemplate(templateData);
        console.log(result, "resultresultresultresultresultresultresult");

        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TemplateResponseDto)
    async getTemplateStatus(@Args('templateId') templateId: string): Promise<TemplateResponseDto> {
        const result = await this.templateService.getTemplateStatusByCron(templateId);
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
        return await this.templateService.findAllTemplate()
    }
}

