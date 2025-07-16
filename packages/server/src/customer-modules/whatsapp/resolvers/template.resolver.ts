import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { TemplateService } from "../services/whatsapp-template.service";
import { WaTemplateRequestInput } from "../dtos/whatsapp.template.dto";
import { WaTemplateResponseDto } from "../dtos/whatsapp.response.dto";
import { FileService } from "src/modules/file-storage/services/file.service";
// import { TemplateResponseDto } from "src/customer-modules/template/dto/TemplateResponseDto";

@Resolver(() => WhatsAppTemplate)
export class TemplateResolver {
    constructor(
        private readonly templateService: TemplateService,
        private fileService: FileService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppTemplate)
    async saveTemplate(@Args('templateData') templateData: WaTemplateRequestInput): Promise<WhatsAppTemplate> {
        // const payload = await this.templateService.generatePayload(templateData)
        return await this.templateService.saveTemplate(templateData, templateData.accountId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppTemplate)
    async updateTemplate(@Args('templateData') templateData: WaTemplateRequestInput,
        @Args('dbTemplateId') dbTemplateId: string): Promise<WhatsAppTemplate> {
        try {
            const payload = await this.templateService.generatePayload(templateData);
            return await this.templateService.updateTemplate(payload, dbTemplateId);
        } catch (err) {
            console.error("UpdateTemplate Resolver Error:", err);
            throw err;
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WaTemplateResponseDto)
    async getTemplateStatus(@Args('templateId') templateId: string): Promise<WaTemplateResponseDto> {
        const result = await this.templateService.getTemplateStatusByCron(templateId);
        if (!result) throw new Error("result doesnt found in resolver templateResolver")

        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };
    }


      @ResolveField(() => String)
      async templateImg(@Parent() template: WhatsAppTemplate): Promise<string> {
        console.log(".......tempalte",template);
        
        if (template.account.name) {
          try {
            const workspaceLogoToken = this.fileService.encodeFileToken({
              workspaceId: template.id,
            });
            return `${template.account.name}?token=${workspaceLogoToken}`;
          } catch (e) {
            return template.account.name;
          }
        }
        return template.account.name ?? '';
      }

}

