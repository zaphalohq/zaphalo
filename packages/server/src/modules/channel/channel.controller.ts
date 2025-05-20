import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelService } from './channel.service';
import { WebSocketService } from './chat-socket';
import { ContactsService } from '../contacts/contacts.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import axios from 'axios'
import { Context } from '@nestjs/graphql';
import { instantsService } from '../whatsapp/instants.service';

const token = 'my-token'

@Controller('webhook')
export class channelController {
  constructor(
    @InjectRepository(Channel, 'core')
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message, 'core')
    private readonly messageRepository: Repository<Message>,
    private readonly webSocketService: WebSocketService,
    private readonly channelservice: ChannelService,
    private readonly contactsservice: ContactsService,
    private readonly instantsService: instantsService,
    ) { }
  @Get()
  getWhatsappApi(@Query() query: any): string {
    const mode = query['hub.mode']
    const challenge = query['hub.challenge']
    const verify_token = query['hub.verify_token']

    if (mode && verify_token === token) {
      return challenge
    }
    return 'This action returns all cats';
  }

  @Post()
  async postWhatsappApi(@Request() req: Request): Promise<any> {
    const data = JSON.parse(JSON.stringify(req.body, null, 2))
    
    if (data && data.entry[0].changes[0].value.messages) {
      const msg = data.entry[0].changes[0].value.messages[0].text.body
      const userPhoneNo = data.entry[0].changes[0].value.messages[0].from;
      const memberIds = [data.entry[0].changes[0].value.metadata.phone_number_id]
      const myPhoneNo = Number(data.entry[0].changes[0].value.metadata.phone_number_id)
      const workspace = await this.contactsservice.findOneContact(myPhoneNo)
      const workspaceId = workspace?.workspace.id
      const createContactNotExist = await this.contactsservice.createContacts({ contactName: userPhoneNo, phoneNo: Number(userPhoneNo)}, workspaceId)
      if (!createContactNotExist) throw new Error('ContactNotExist not found');
      const {channel , newChannelCreated }: any = await this.channelservice.findOrCreateChannel(userPhoneNo, [Number(memberIds), Number(userPhoneNo)], "f751daf2-8241-44dd-babb-f86a3069b17e")
      if (!channel.id) throw new Error('channel not found');
      const message = await this.channelservice.createMessage(msg, channel.id, Number(userPhoneNo), workspaceId)

      const channelId = await channel.id
      this.webSocketService.sendMessageToChannel(channelId, message, Number(userPhoneNo), newChannelCreated)
      return message
    }
  }
}