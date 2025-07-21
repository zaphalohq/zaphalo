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
export class WhatsAppTemplateResolver {
  constructor(
    private readonly templateService: TemplateService,
    private fileService: FileService
  ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [WhatsAppTemplate])
    async findAllTemplate(@Context('req') req): Promise<WhatsAppTemplate[]> {
      const data = await this.templateService.findAllTemplate();
      return data
    }
  
    @UseGuards(GqlAuthGuard)
    @Query(() => [WhatsAppTemplate])
    async findAllApprovedTemplate(@Context('req') req): Promise<WhatsAppTemplate[]> {
      const data = await this.templateService.findAllApprovedTemplate();
      return data
    }
  

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppTemplate)
  async saveTemplate(@Args('templateData') templateData: WaTemplateRequestInput,
    @Args('dbTemplateId', { nullable : true }) dbTemplateId?: string): Promise<WhatsAppTemplate> {

    if (dbTemplateId) {
      console.log('updated.....................');
      
      return await this.templateService.updateTemplate(templateData, dbTemplateId, templateData.accountId);

    } else {
      console.log('saved....................');
      
      return await this.templateService.saveTemplate(templateData, templateData.accountId);
    }

  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WaTemplateResponseDto)
  async getTemplateStatus(@Args('templateId') templateId: string): Promise<WaTemplateResponseDto> {
    const result = await this.templateService.getTemplateStatusByCron(templateId);
    if (!result) throw new Error("result doesnt found in resolver templateResolver")

    return {
      success: result.success,
      // data: result.data ? JSON.stringify(result.data) : undefined,
      // error: result.error ? JSON.stringify(result.error) : ,
    };
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => String)
  async templateImg(@Parent() template: WhatsAppTemplate, @Context() context): Promise<string> {
    console.log(context.req.headers['x-workspace-id'], '.................');
    const workspaceId = context.req.headers['x-workspace-id']
    if (template.templateImg) {
      try {
        const workspaceLogoToken = this.fileService.encodeFileToken({
          workspaceId: workspaceId,
        });

        return `${template.templateImg}?token=${workspaceLogoToken}`;

      } catch (e) {
        return template.templateImg;
      }
    }
    return template.templateImg ?? '';
  }

}

