import "dotenv/config"
import {createServer} from "http"
import {parse} from "url"
import {Socket} from "socket.io"

export class SocketConnection {
  private readonly room: string;

  constructor(private client: Socket) {
    this.room = this.client.handshake?.query.room as string;
    this.handleConnection();
  }

  private handleConnection() {
    if (!this.room) {
      this.client.disconnect();
      return;
    }
    this.client.join(this.room);
    this.client.on("disconnect", this.handleDisconnect.bind(this));

    this.subscribeEvents();
  }

  private handleDisconnect() {
    this.client.leave(this.room);
  }

  private subscribeEvents() {
    this.client.on("request_connection", (message: any) => {
      this.broadcastMessages("request_connection", message);
    });
    this.client.on("sdp", (message: any) => {
      this.broadcastMessages("sdp", message);
    });
    this.client.on("ice", (message: any) => {
      this.broadcastMessages("ice", message);
    });
    this.client.on("language", (message: any) => {
      this.broadcastMessages("language", message);
    });
  }

  private broadcastMessages(event: string, message: any) {
    this.client.broadcast.to(this.room).emit(event, message);
    console.log(event, " => ", message, " => ", this.room);
  }
}
