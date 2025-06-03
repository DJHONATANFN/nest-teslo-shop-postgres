import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server
  private logger = new Logger();
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService:JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload:JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id!);
    } catch (error) {
      this.logger.error('WebSocket Error', error);
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    // // Emite a un unico cliente
    // client.emit('message-from-server',{
    //   fullName: 'soy yo',
    //   message: payload.message || 'no-message'
    // });

    // // Emitir a todos menos al cliente que emite el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no-message'
    // });

    // Emitir a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });
  }

}
