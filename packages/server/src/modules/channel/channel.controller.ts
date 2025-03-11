import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { channelService } from './channel.service';

const token = 'my-token'

@Controller('webhook')
export class channelController {
    constructor(
        @InjectRepository(Channel, 'core')
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private readonly messageRepository: Repository<Message>,

        private readonly channelservice: channelService,
    ) { }

    @Get()
    getWhatsappApi(@Query() query: any): string {
        console.log(query);
        const mode = query['hub.mode']
        const challenge = query['hub.challenge']
        const verify_token = query['hub.verify_token']
        console.log(mode, challenge, verify_token);

        if (mode && verify_token === token) {
            return challenge
        }

        return 'This action returns all cats';
    }

    @Post()
    async postWhatsappApi(@Request() req: Request): Promise<any> {
        console.log(JSON.stringify(req.body, null, 2));
        const data = JSON.parse(JSON.stringify(req.body, null, 2))
        
        if(data && data.entry[0].changes[0].value.messages){
        const msg = data.entry[0].changes[0].value.messages[0].text.body
        const senderId = data.entry[0].changes[0].value.messages[0].from;
        const memberIds = [data.entry[0].changes[0].value.metadata.phone_number_id]
        console.log(data.entry[0].changes[0].value.messages[0].text.body)
        const channel = await this.channelservice.findOrCreateChannel([Number(memberIds), Number(senderId)] ,Number(senderId) )
        const message = await this.channelservice.createMessage(msg, channel.id, senderId)
        return message
    }
    }


    // @UseGuards(AuthGuard('jwt'))
    @Post('sendMsg')
    async sendMessage(@Body('senderId') senderId: String,
        @Body('receiverId') receiverId: any,
        @Body('msg') msg: string,
        @Body('channelName') channelName: string,
    ): Promise<any> {

        const response = await axios({
            url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.Whatsapp_Token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "messaging_product": "whatsapp",
                "to": receiverId[0],
                "type": "text",
                "text": {
                    'body': msg
                }
            })
        })
        console.log(response);
        const memberIds = [...receiverId, senderId]
        const channel = await this.channelservice.findOrCreateChannel(memberIds ,senderId,channelName )
        const message = await this.channelservice.createMessage(msg, channel.id, senderId)
        return message;
    }

}