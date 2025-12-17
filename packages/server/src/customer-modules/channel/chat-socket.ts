import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export const WEBSOCKET_PORT =
  process.env.WEBSOCKET_PORT || 4000

@WebSocketGateway(Number(WEBSOCKET_PORT) || undefined, {
  namespace: '/chat',
  cors: {
    origin: '*'
  },
  transports: ['websocket', 'polling'],
})
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server : Server

  private userCount = 0;

  handleConnection(client: Socket, ...args: any[]) {
    this.userCount += 1;
  }

  @SubscribeMessage('ping')
  ping(@MessageBody() data: any) {
    return { ok: true };
  }

  @SubscribeMessage("message")
  handleMessage( client : Socket , message  :any) : void {
    this.server.emit("message", "brodcasting............")
  }

  sendMessageToChannel(channel, sender, messages, newChannelCreated) {
    const message = JSON.stringify({messages, sender, channelId: channel.id, newChannelCreated})
    this.server.emit('message', message);
  }

  createMessageInChannel(returnMessage){
    const returnMsg=JSON.stringify(returnMessage)
    this.server.emit('createMessage',returnMsg)
  }

  handleDisconnect(client: Socket) {
    this.userCount -= 1;
  }
}
