import { Controller, Get, Post, Query, Request, UseGuards, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { WebSocketService } from './chat-socket';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { WaAccountService } from 'src/customer-modules/whatsapp/services/whatsapp-account.service';
import { WaWebhookGuard } from './guards/wa_webhook_guard';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';

@Controller('whatsapp')
export class channelController {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly channelservice: ChannelService,
    private readonly contactsservice: ContactsService,
    private readonly waAccountService: WaAccountService,
    private readonly jwtWrapperService: JwtWrapperService,                  
    ) { }

  @Get('/:workspace/webhook')
  @UseGuards(WaWebhookGuard)
  getWhatsappApi(@Query() query: any) {
    const challenge = query['hub.challenge']
    const verify_token = query['hub.verify_token']
    const verified =  this.jwtWrapperService.verifyWorkspaceToken(verify_token,'API_KEY')
    
    if (verified) {
      return challenge
    }
  }

  @Post('/:workspace/webhook')
  async postWhatsappApi(@Request() req: Request): Promise<any> {
    const data = JSON.parse(JSON.stringify(req.body, null, 2))
    console.log(data,'.... .......................');
    
    if (data && data.entry[0].changes[0].value.messages) {
      const textMessage = data.entry[0].changes[0].value.messages[0].text.body
      const userPhoneNo = data.entry[0].changes[0].value.messages[0].from;
      const memberIds = [data.entry[0].changes[0].value.metadata.phone_number_id]
      const myAccountPhoneNo = Number(data.entry[0].changes[0].value.metadata.phone_number_id)

      const createContactNotExist = await this.contactsservice.createContacts({ contactName: userPhoneNo, phoneNo: Number(userPhoneNo)})
      if (!createContactNotExist) throw new Error('ContactNotExist not found');
      const {channel , newChannelCreated }: any = await this.channelservice.findOrCreateChannel(userPhoneNo, [Number(memberIds), Number(userPhoneNo)])
      if (!channel.id) throw new Error('channel not found');
      const message = await this.channelservice.createMessage(textMessage, channel.id, Number(userPhoneNo))

      const channelId = await channel.id
      this.webSocketService.sendMessageToChannel(channelId, message, Number(userPhoneNo), newChannelCreated)
      return message
    }
  }
}