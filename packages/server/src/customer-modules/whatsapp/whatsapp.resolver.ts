import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import graphqlTypeJson from 'graphql-type-json';


import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WhatsAppTemplate } from './entities/whatsapp-template.entity';
import { WaAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service'
import { TemplateService } from './services/whatsapp-template.service';
// import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
// import { WhatsAppAccount } from 'src/customer-modules/whatsapp/entities/whatsapp-account.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { TestTemplateOutput, WaTestTemplateInput } from "./dtos/test-input.template.dto";
import { WaTemplateResponseDto } from "./dtos/whatsapp.response.dto";
import { WaTemplateRequestInput } from "./dtos/whatsapp.template.dto";

@Resolver(() => WhatsAppAccount)
export class WhatsAppResolver {
  // constructor(
  //   private readonly whatsAppApiService: WhatsAppSDKService,
  //   private readonly instantsService: instantsService) { }

  constructor(
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly waTemplateService: TemplateService
  ) { }


  // @UseGuards(GqlAuthGuard)
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
  @Mutation(() => WaTemplateResponseDto)
  async submitWaTemplate(
    @Context('req') req, @Args('templateData') templateData: WaTemplateRequestInput,
    @Args('dbTemplateId', { nullable: true }) dbTemplateId?: string
  ): Promise<WaTemplateResponseDto> {
    const wa_api = await this.getWhatsAppApi(templateData.accountId)

    let response;
    if (dbTemplateId) {
      const template: any = await this.waTemplateService.updateTemplate(templateData, dbTemplateId)
      let payload
      if (template.attachment) {
        const header_handle = await wa_api.uploadDemoDocument(template.attachment);
        payload = await this.waTemplateService.generatePayload(templateData, header_handle);
      }
      const payload_json = JSON.stringify({ ...payload });
      response = await wa_api.submitTemplateUpdate(payload_json, template.waTemplateId);
      await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id)
    } else {

      const template: any = await this.waTemplateService.saveTemplate(templateData, templateData.accountId)
      let payload
      if (template.attachment) {
        const header_handle = await wa_api.uploadDemoDocument(template.attachment);
        payload = await this.waTemplateService.generatePayload(templateData, header_handle);
      }
      const payload_json = JSON.stringify({ ...payload });
      response = await wa_api.submitTemplateNew(payload_json);
      await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id)
    }
    return response
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

  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppTemplate])
  async findAllTemplate(@Context('req') req): Promise<WhatsAppTemplate[]> {
    const data = await this.waTemplateService.findAllTemplate();
    return data
  }

  @Mutation(() => TestTemplateOutput)
  async testTemplate(@Args('testTemplateData') testTemplateData: WaTestTemplateInput) {
    const wa_api = await this.getWhatsAppApi()

    const template: any = await this.waTemplateService.findtemplateById(testTemplateData.dbTemplateId)
    console.log(template,'.....');
    
    if (!template) throw Error('template doesnt exist')

    let generateTemplatePayload
    if (template.attachment) {
      const mediaLink = await wa_api.uploadDemoDocument(template.attachment);
      // const mediaLink = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
      generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, testTemplateData.testPhoneNo, mediaLink);
    }


    const testTemplate = await wa_api.testTemplate(JSON.stringify(generateTemplatePayload))
        console.log(testTemplate,'....................testTemplate');
        
    return { success: 'test template send successfully' }
  }



}