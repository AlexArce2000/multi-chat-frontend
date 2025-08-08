import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { WebSocketService } from 'src/app/core/services/websocket.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.scss']
})
export class ChatLobbyComponent implements OnInit, OnDestroy {
  
  private messageSubscription: Subscription | undefined;
  public receivedMessages: any[] = [];

  // Inyectamos el WebSocketService
  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.webSocketService.initAndConnect();

    const testRoomId = 'ea45c6a8-f041-482a-8657-3f033da3cadf'; 
    this.messageSubscription = this.webSocketService.watchTopic(`/topic/rooms/${testRoomId}`)
      .subscribe((message: any) => {
        console.log('Mensaje recibido:', message);
        this.receivedMessages.push(message);
      });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.webSocketService.deactivate();
  }

  logout(): void {
    this.authService.logout();
  }

  sendMessageTest(): void {
    const testRoomId = 'ea45c6a8-f041-482a-8657-3f033da3cadf';
    const messagePayload = {
      remitente: 'testuser', 
      contenido: '¡Hola desde Angular con RxStomp!'
    };
    this.webSocketService.publishMessage(`/app/chat.sendMessage/${testRoomId}`, messagePayload);
  }
}