import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { WaTemplateService } from "../services/whatsapp-template.service";
import { WaTemplateRequestInput } from "../dtos/whatsapp.template.dto";
import { WaTemplateResponseDto } from "../dtos/whatsapp.response.dto";
import { FileService } from "src/modules/file/services/file.service";
import { SearchedRes } from "../dtos/searched.dto";
import { SuccessResponse } from "../dtos/success.dto";
import { WaAccountService } from '../services/whatsapp-account.service';
import { ManyTemplatesResponse } from "src/customer-modules/whatsapp/dtos/templates/many-templates-response.dto";
import { TemplateResponse } from "src/customer-modules/whatsapp/dtos/templates/template-response.dto";
import { TestTemplateOutput, WaTestTemplateInput } from "src/customer-modules/whatsapp/dtos/test-input.template.dto";
import { WaAccountResponse } from 'src/customer-modules/whatsapp/dtos/account/account-response.dto';
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";


@Resolver(() => WhatsAppTemplate)
export class WhatsAppTemplateResolver {
  constructor(
    private readonly templateService: WaTemplateService,
    private readonly waAccountService: WaAccountService,
    private fileService: FileService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TemplateResponse)
  async saveTemplate(
    @Args('templateData') templateData: WaTemplateRequestInput
  ): Promise<TemplateResponse | undefined> {
    if (templateData.templateId){
      return await this.templateService.updateTemplate(templateData);
    }else{
      return await this.templateService.createTemplate(templateData);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TemplateResponse)
  async submitTemplate(@Args('templateId') templateId: string): Promise<TemplateResponse | undefined> {
    return await this.templateService.submitTemplate(templateId);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => String)
  async templateImg(@Parent() template: WhatsAppTemplate, @Context() context): Promise<string> {
    const workspaceId = context.req.headers['x-workspace-id']
    if (template.attachment) {
      try {
        const signPath = this.fileService.signFileUrl({
          url: template.attachment.path,
          workspaceId: workspaceId,
        });
        return signPath
      } catch (e) {
        return ''
      }
    }
    return '';
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
      @Args('filter', { type: () => GraphQLJSONObject, nullable: true }) filter?: Record<string, any>,
  ): Promise<WhatsAppTemplate[] | undefined> {
      const waTemplates = await this.templateService.readWaTemplate(search, filter, limit);
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
    return await this.templateService.testTemplate(testTemplateData)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TemplateResponse)
  async syncTemplate(
    @AuthWorkspace() workspace: Workspace,
    @Args('templateId') templateId: string
  ): Promise<TemplateResponse> {
    const response = await this.templateService.syncTemplate(workspace.id, templateId);
    return response
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WaAccountResponse)
  async syncWhatsAppAccountTemplates(
    @AuthWorkspace() workspace: Workspace,
    @Args('waAccountId') waAccountId: string,
  ): Promise<WaAccountResponse> {
    if (!waAccountId) {
      throw Error("WhatsApp account id not provided")
    }
    return await this.templateService.syncWhatsAppAccountTemplates(workspace.id, waAccountId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(()=> TemplateResponse)
  async deleteTemplate(
    @Args('templateIds', { type: () => [String] }) templateIds: string[],
  ): Promise<TemplateResponse>{
    return this.templateService.deleteTemplate(templateIds)
  }

}

