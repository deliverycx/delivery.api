import { ApiTags } from "@nestjs/swagger";
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { StopListEntity } from "src/components/stopList/entities/stopList.entity";

@WebSocketGateway({
    namespace: "iiko",
    cors: "*"
})
@ApiTags("Websockets")
export class IikoWebsocketGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log("Initialized socket", server);
    }

    async sendStopListToClient(data: any) {
        this.server.emit("stoplist_event", { data: data });
    }
}
