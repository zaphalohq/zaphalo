import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import graphqlTypeJson from 'graphql-type-json';
import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WaAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service'
import { TemplateService } from './services/whatsapp-template.service';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { TestTemplateOutput, WaTestTemplateInput } from "./dtos/test-input.template.dto";
import { WaTemplateResponseDto } from "./dtos/whatsapp.response.dto";
import { WaTemplateRequestInput } from "./dtos/whatsapp.template.dto";
import { WaAccountDto } from "./dtos/whatsapp-account-update.dto";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { SuccessResponse } from "./dtos/success.dto";

@Resolver(() => WhatsAppAccount)
export class WhatsAppResolver {
  constructor(
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly waTemplateService: TemplateService
  ) { }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async testConnection(
    @Context('req') req,
  ): Promise<String> {
    const findTrueInstants = await this.waAccountService.FindSelectedInstants()

    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const wa_api = this.whatsAppApiService.getWhatsApp(findTrueInstants)

    try {
      wa_api._test_connection()
    }
    catch (err) {
      return "{'status': 401, 'error': 'Credentials not look good!'}"
    }

    return "{'status': 200, 'message': 'Credentials look good!'}"
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppAccount])
  async findAllWhatsAppAccounts(): Promise<WhatsAppAccount[]> {
    return await this.waAccountService.findAllAccounts();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => graphqlTypeJson)
  async getAllWhatsAppTemplates() {
    const wa_api = await this.getWhatsAppApi()
    const data = await wa_api.getAllTemplate();
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => graphqlTypeJson)
  async getWaTemplatesDetails(@Args('waTemplateId') waTemplateId: string) {
    const findTrueInstants = await this.waAccountService.FindSelectedInstants()

    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const wa_api = this.whatsAppApiService.getWhatsApp(findTrueInstants)
    const data = await wa_api.getTemplateData(waTemplateId);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SuccessResponse)
  async submitWaTemplate(
    @Context('req') req, @Args('templateData') templateData: WaTemplateRequestInput,
    @Args('waTemplateId', { nullable: true }) waTemplateId?: string,
    @Args('dbTemplateId', { nullable: true }) dbTemplateId?: string
  ): Promise<SuccessResponse> {
    const wa_api = await this.getWhatsAppApi(templateData.accountId)

    let response;
    if (waTemplateId) {

      const template: any = await this.waTemplateService.updateTemplate(templateData, dbTemplateId)
      let payload
      if (template.attachment) {
        const header_handle = await wa_api.uploadDemoDocument(template.attachment);
        payload = await this.waTemplateService.generatePayload(templateData, header_handle);
      } else {
        payload = await this.waTemplateService.generatePayload(templateData);
      }
      const payload_json = JSON.stringify({ ...payload });
      response = await wa_api.submitTemplateUpdate(payload_json, template.waTemplateId);
      const updatedTemplate = await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id);
      this.waTemplateService.getTemplateStatusByCron(updatedTemplate.waTemplateId)

    } else {

      if (dbTemplateId) {
        const template: any = await this.waTemplateService.updateTemplate(templateData, dbTemplateId)
        let payload

        if (template.attachment) {
          const header_handle = await wa_api.uploadDemoDocument(template.attachment);
          payload = await this.waTemplateService.generatePayload(templateData, header_handle);
        } else {
          payload = await this.waTemplateService.generatePayload(templateData);
        }

        const payload_json = JSON.stringify({ ...payload });
        response = await wa_api.submitTemplateNew(payload_json);
        const updatedTemplate = await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id);
        this.waTemplateService.getTemplateStatusByCron(updatedTemplate.waTemplateId)

      } else {
        const template: any = await this.waTemplateService.saveTemplate(templateData, templateData.accountId)
        let payload

        if (template.attachment) {
          const header_handle = await wa_api.uploadDemoDocument(template.attachment);
          payload = await this.waTemplateService.generatePayload(templateData, header_handle);
        }

        const payload_json = JSON.stringify({ ...payload });

        response = await wa_api.submitTemplateNew(payload_json);
        const updatedTemplate = await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id)
        this.waTemplateService.getTemplateStatusByCron(updatedTemplate.waTemplateId)

      }

    }
    return {
      success : response.success,
      message : JSON.stringify(response.data),
      error : response.error
    }
  }

  async getWhatsAppApi(instantsId?: string) {
    if (instantsId) {
      const instants = await this.waAccountService.findInstantsByInstantsId(instantsId)
      if (!instants)
        throw new Error("Not found whatsappaccount")
      return this.whatsAppApiService.getWhatsApp(instants)
    } else {
      const findTrueInstants = await this.waAccountService.FindSelectedInstants()
      if (!findTrueInstants)
        throw new Error("Not found whatsappaccount")

      return this.whatsAppApiService.getWhatsApp(findTrueInstants)
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WaTemplateResponseDto)
  async sendWaTemplate(
    @Context('req') req,
    @Args('waTemplateId') waTemplateId: string
  ) {
    const wa_api = await this.getWhatsAppApi()

  }


  @Mutation(() => TestTemplateOutput)
  async testTemplate(@Args('testTemplateData') testTemplateData: WaTestTemplateInput) {
    const wa_api = await this.getWhatsAppApi()

    const template: any = await this.waTemplateService.findtemplateByDbId(testTemplateData.dbTemplateId)

    if (!template) throw Error('template doesnt exist')

    let generateTemplatePayload
    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(template.headerType)) {
      const mediaLink = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
      generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, testTemplateData.testPhoneNo, mediaLink);
    } else {
      generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, testTemplateData.testPhoneNo);
    }
    const testTemplate = await wa_api.sendTemplateMsg(JSON.stringify(generateTemplatePayload))
    return { success: 'test template send successfully' }
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async SyncAndSaveInstants(
    @Context('req') req,
    @Args('whatsappInstantsData') waAccount: WaAccountDto,
  ): Promise<WhatsAppAccount | null | string> {
    if (!waAccount.accountId) {
      const instances = await this.waAccountService.WaAccountCreate(req, waAccount);
      const wa_api = await this.getWhatsAppApi(instances.id)
      if (instances) {
        const syncTemplate = await wa_api.syncTemplate();
        await this.waTemplateService.saveSyncTemplates(syncTemplate, instances)
      }
      return instances;
    } else {
      const wa_api = await this.getWhatsAppApi(waAccount.accountId)
      const instances = await this.waAccountService.UpdateInstants(waAccount.accountId, waAccount);
      if (instances) {
        const syncTemplate = await wa_api.syncTemplate();
        await this.waTemplateService.saveSyncTemplates(syncTemplate, instances)
      }
      return instances;
    }

  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async TestAndSaveInstants(
    @AuthWorkspace() workspace: Workspace,
    @Context('req') req,
    @Args('whatsappInstantsData') waAccount: WaAccountDto,
  ): Promise<WhatsAppAccount | null> {
    if (!waAccount.accountId) {
      const instances = await this.waAccountService.WaAccountCreate(req, waAccount);
      const wa_api = await this.getWhatsAppApi(instances.id)
      if (instances) {
        const testTemplate = await wa_api.testInstants()
      }
      return instances
    } else {
      const instances = await this.waAccountService.UpdateInstants(waAccount.accountId, waAccount);
      const wa_api = await this.getWhatsAppApi(waAccount.accountId)
      if (instances) {
        const testTemplate = await wa_api.testInstants()
      }
      return instances;
    }

  }


}