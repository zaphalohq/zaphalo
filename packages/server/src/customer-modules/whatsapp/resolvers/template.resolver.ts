import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { TemplateService } from "../services/whatsapp-template.service";
import { WaTemplateRequestInput } from "../dtos/whatsapp.template.dto";
import { WaTemplateResponseDto } from "../dtos/whatsapp.response.dto";
import { FileService } from "src/modules/file-storage/services/file.service";
import { FindAllTemplate } from "../dtos/findAllTemplate.dto";
import { SearchedRes } from "../dtos/searched.dto";
import { SuccessResponse } from "../dtos/success.dto";

@Resolver(() => WhatsAppTemplate)
export class WhatsAppTemplateResolver {
  constructor(
    private readonly templateService: TemplateService,
    private fileService: FileService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => FindAllTemplate)
  async findAllTemplate(
    @Args('currentPage', { type: () => Int }) currentPage: number,
    @Args('itemsPerPage', { type: () => Int }) itemsPerPage: number
  ): Promise<FindAllTemplate> {
    return await this.templateService.findAllTemplate(currentPage, itemsPerPage);
  }

  @Query(() => SearchedRes)
  async searchedTemplate(
    @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
  ): Promise<SearchedRes | null> {
    return this.templateService.searchedTemplate(searchTerm);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppTemplate])
  async findAllApprovedTemplate(@Context('req') req): Promise<WhatsAppTemplate[]> {
    const data = await this.templateService.findAllApprovedTemplate();
    return data
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => SuccessResponse)
  async saveTemplate(@Args('templateData') templateData: WaTemplateRequestInput,
    @Args('dbTemplateId', { nullable: true }) dbTemplateId?: string): Promise<SuccessResponse | undefined> {

    try {
      if (dbTemplateId) {
        const template = await this.templateService.updateTemplate(templateData, dbTemplateId, templateData.accountId);
        if (template)
          return {
            success: true,
            message: 'template saved successfully!'
          }
      } else {
        const template = await this.templateService.saveTemplate(templateData, templateData.accountId);
        if (template)
          return {
            success: true,
            message: 'template saved successfully!'
          }
      }
    } catch (error) {
      return {
        success: false,
        message: String(error)
      }
    }

  }

  @UseGuards(GqlAuthGuard)
  @Query(() => WhatsAppTemplate)
  async findtemplateByDbId(@Args('dbTemplateId') dbTemplateId: string): Promise<WhatsAppTemplate | null> {
    return await this.templateService.findtemplateByDbId(dbTemplateId)
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
    const workspaceId = context.req.headers['x-workspace-id']
      console.log('..templateImage.............................');

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

