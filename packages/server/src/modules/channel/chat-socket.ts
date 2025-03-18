import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(8080, { cors: { origin: '*' } }) // Port 8080 with CORS enabled
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server : Server

    private userCount = 0;

    handleConnection(client: Socket, ...args: any[]) {
        this.userCount += 1;
        console.log("No of client connected", this.userCount, client.id)
        
    }

    @SubscribeMessage("message")
    handleMessage( client : Socket , message  :any) : void {
      console.log(message)
      client.emit("reply","from xys")
    this.server.emit("reply", "brodcasting............")
    }

    handleDisconnect(client: Socket) {
        this.userCount -= 1;
        console.log("no of user connected", this.userCount, client.id)
    }


}
