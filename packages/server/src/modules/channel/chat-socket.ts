import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { WebSocketServer } from "ws";

@Injectable()
export class WebSocketService implements OnApplicationBootstrap {
    private wss: WebSocketServer;
    private allSockets: WebSocket[] = [];
    private userCount = 0;

onApplicationBootstrap() {
this.wss = new WebSocketServer({ port : 8080 })

this.wss.on("connection", (socket) => {
    this.userCount = this.userCount + 1;
    console.log("no of user" , this.userCount);

    this.allSockets.push(socket)

    socket.on("message", (message) => {
        console.log(message.toString())
        this.allSockets.forEach((socket) => {
            socket.send(message.toString()+'but from sever')
        })   
    })

    socket.on("disconnect", () => {
        this.allSockets.filter( x => x !== socket)
    })
    
})
}}