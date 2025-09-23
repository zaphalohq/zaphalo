import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { WaTemplateService } from "../services/whatsapp-template.service";
import { WaTemplateRequestInput } from "../dtos/whatsapp.template.dto";
import { WaTemplateResponseDto } from "../dtos/whatsapp.response.dto";
import { FileService } from "src/modules/file-storage/services/file.service";
import { SearchedRes } from "../dtos/searched.dto";
import { SuccessResponse } from "../dtos/success.dto";
import { WaAccountService } from '../services/whatsapp-account.service';

import { ManyTemplatesResponse } from "src/customer-modules/whatsapp/dtos/templates/many-templates-response.dto";
import { TemplateResponse } from "src/customer-modules/whatsapp/dtos/templates/template-response.dto";
import { TestTemplateOutput, WaTestTemplateInput } from "src/customer-modules/whatsapp/dtos/test-input.template.dto";


@Resolver(() => WhatsAppTemplate)
export class WhatsAppTemplateResolver {
  constructor(
    private readonly templateService: WaTemplateService,
    private readonly waAccountService: WaAccountService,
    private fileService: FileService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SuccessResponse)
  async saveTemplate(@Args('templateData') templateData: WaTemplateRequestInput): Promise<SuccessResponse | undefined> {
    try {
      if (templateData.templateId) {
        const template = await this.templateService.updateTemplate(templateData, templateData.templateId, templateData.whatsappAccountId);
        if (template)
          return {
            success: true,
            message: 'template saved successfully!'
          }
      } else {
        const template = await this.templateService.saveTemplate(templateData, templateData.whatsappAccountId);
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
  @ResolveField(() => String)
  async templateImg(@Parent() template: WhatsAppTemplate, @Context() context): Promise<string> {
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

  @UseGuards(GqlAuthGuard)
  @Query(() => TemplateResponse)
  async getTemplate(
    @Args('templateId') templateId: string
  ): Promise<TemplateResponse> {
    const response = await this.templateService.getTemplate(templateId);
    return response
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppTemplate])
  async readWaTemplate(
      @Args('search', { type: () => String, nullable: true }) search?: string,
      @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<WhatsAppTemplate[] | undefined> {
      const waTemplates = await this.templateService.readWaTemplate(search, limit);
      return waTemplates
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ManyTemplatesResponse)
  async searchReadTemplate(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
  ) {
    if(!search)
      search = ''
    if(!filter)
      filter = ''

    const response = await this.templateService.searchReadTemplate(page, pageSize, search, filter)
    return response
  }

  @Mutation(() => TestTemplateOutput)
  async testTemplate(@Args('testTemplateData') testTemplateData: WaTestTemplateInput) {
    const template: any = await this.templateService.getTemplate(testTemplateData.dbTemplateId)

    const wa_api = await this.waAccountService.getWhatsAppApi(template.account.id)

    if (!template) throw Error('template doesnt exist')

    let generateTemplatePayload
    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(template.headerType)) {
      const mediaLink = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
      generateTemplatePayload = await this.templateService.generateSendMessagePayload(template, testTemplateData.testPhoneNo, mediaLink);
    } else {
      generateTemplatePayload = await this.templateService.generateSendMessagePayload(template, testTemplateData.testPhoneNo);
    }
    const testTemplate = await wa_api.sendTemplateMsg(JSON.stringify(generateTemplatePayload))
    return { success: 'test template send successfully' }
  }

}

