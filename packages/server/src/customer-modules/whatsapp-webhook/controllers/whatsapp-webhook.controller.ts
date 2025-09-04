import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  ForbiddenException
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";

import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { WaWebhookGuard } from 'src/customer-modules/whatsapp-webhook/guards/whatsapp-webhook.guard';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { FileService } from 'src/modules/file-storage/services/file.service';
import { WaTemplateService } from 'src/customer-modules/whatsapp/services/whatsapp-template.service';
import { WaAccountService } from 'src/customer-modules/whatsapp/services/whatsapp-account.service';
import { WhatsAppWebhookService } from 'src/customer-modules/whatsapp-webhook/whatsapp-webhook.service';


@Controller('whatsapp')
export class WhatsAppWebhookController {
  constructor(
    private readonly contactService: ContactsService,
    private readonly jwtWrapperService: JwtWrapperService,
    // private readonly attachmentService: AttachmentService,
    private fileService: FileService,
    private waTemplateService: WaTemplateService,
    private waAccountService: WaAccountService,
    private whatsAppWebhookService: WhatsAppWebhookService,

  ) { }

  @Get('/:workspace/webhook')
  @UseGuards(WaWebhookGuard)
  async getWhatsappApi(@Query() query: any) {
    const challenge = query['hub.challenge']
    const verify_token = query['hub.verify_token']
    const verified = this.jwtWrapperService.verifyWorkspaceToken(verify_token, 'API_KEY')

    if (verified) {
      return challenge
    }
  }

  @Post('/:workspace/webhook')
  async waWebhookPost(@Request() req: ExpressRequest): Promise<any>{
    const workspaceId = req.params.workspace;
    const data = JSON.parse(JSON.stringify(req.body, null, 2))
    for(const entry of data['entry']) {
      var businessAccountId = entry['id']
      var waAccount = await this.waAccountService.findInstantsByAccounID(businessAccountId)

      if (!this.whatsAppWebhookService.checkSignature(req, waAccount)){
        throw new ForbiddenException('Access to this resource is denied.');
      }
      for(const changes of entry['changes']) {
        const value = changes['value']

        let phoneNumberId = value['metadata']?.phone_number_id;
        if (!phoneNumberId){
          phoneNumberId = value['whatsapp_business_api_data']?.phone_number_id
        }
        if (phoneNumberId){
          waAccount = await this.waAccountService.getWaAccountPhoneAndAccountId(phoneNumberId, businessAccountId)
          if (waAccount){
            // # Process Messages and Status webhooks
            if (changes['field'] == 'messages'){
              this.whatsAppWebhookService.processMessages(req, waAccount, value)
            }
          }
          else{
            console.log(`There is no phone configured for this whatsapp webhook : ${data} `)
          }
        }

        // # Process Template webhooks
        if (value['message_template_id']){
            // # There is no user in webhook, so we need to SUPERUSER_ID to write on template object
            const template = await this.waTemplateService.findTemplateByWaTemplateId(value['message_template_id'])
            if (template){
                if (changes['field'] == 'message_template_status_update'){
                  this.waTemplateService.updateTemplate({'status': value['event'], 'noUpdateToWhatsapp': true}, template.id)
                  if (value['event'] == 'REJECTED'){
                    let body = "Your Template has been rejected."
                    const description = value['other_info']?.description || value['reason']
                    if (description){
                      body += `Reason : ${description}`
                    }
                    this.waTemplateService.updateTemplate({'failureReason': body, 'noUpdateToWhatsapp': true}, value['message_template_id'])
                  }
                  continue
                }
                if (changes['field'] == 'message_template_quality_update'){
                  let new_quality_score = value['new_quality_score']
                  new_quality_score = {'unknown': 'none'}[new_quality_score] || new_quality_score
                  this.waTemplateService.updateTemplate({'quality': new_quality_score, 'noUpdateToWhatsapp': true}, value['message_template_id'])
                  continue
                }
                if (changes['field'] == 'template_category_update'){
                    this.waTemplateService.updateTemplate({'category': value['new_category'], 'noUpdateToWhatsapp': true}, value['message_template_id'])
                    continue
                }
                console.log(`Unknown Template webhook : ${value}`)
            }
            else{
              console.log(`No Template found for this webhook : `, )
            }
        }
      }
    }
    return
  }
}