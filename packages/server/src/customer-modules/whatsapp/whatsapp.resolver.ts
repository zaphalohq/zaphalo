import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import graphqlTypeJson from 'graphql-type-json';
import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WaAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service'
import { WaTemplateService } from './services/whatsapp-template.service';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { TestTemplateOutput, WaTestTemplateInput } from "./dtos/test-input.template.dto";
import { WaTemplateResponseDto } from "./dtos/whatsapp.response.dto";
import { WaTemplateRequestInput } from "./dtos/whatsapp.template.dto";
import { WaAccountDto } from "./dtos/whatsapp-account-update.dto";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { SuccessResponse } from "./dtos/success.dto";
import { WaMessageService } from './services/whatsapp-message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WhatsAppMessageCreatedEvent } from 'src/customer-modules/whatsapp/events/whatsapp-message-created.event';


@Resolver(() => WhatsAppAccount)
export class WhatsAppResolver {
  constructor(
    private readonly waAccountService: WaAccountService,
    private readonly messageService: WaMessageService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly waTemplateService: WaTemplateService,
    private eventEmitter: EventEmitter2
  ) { }


  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppAccount])
  async findAllWhatsAppAccounts(): Promise<WhatsAppAccount[]> {
    return await this.waAccountService.findAllAccounts();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => graphqlTypeJson)
  async getAllWhatsAppTemplates() {
    const wa_api = await this.waAccountService.getWhatsAppApi()
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
    const wa_api = await this.waAccountService.getWhatsAppApi(templateData.whatsappAccountId)

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

      } else {
        const template: any = await this.waTemplateService.saveTemplate(templateData, templateData.whatsappAccountId)
        let payload

        if (template.attachment) {
          const header_handle = await wa_api.uploadDemoDocument(template.attachment);
          payload = await this.waTemplateService.generatePayload(templateData, header_handle);
        }

        const payload_json = JSON.stringify({ ...payload });

        response = await wa_api.submitTemplateNew(payload_json);
        const updatedTemplate = await this.waTemplateService.updateTemplate(JSON.parse(response.data), template.id)

      }

    }
    return {
      success : response.success,
      message : JSON.stringify(response.data),
      error : response.error
    }
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => WaTemplateResponseDto)
  async sendWaTemplate(
    @Context('req') req,
    @Args('waTemplateId') waTemplateId: string
  ) {
    const wa_api = await this.waAccountService.getWhatsAppApi()

  }
}