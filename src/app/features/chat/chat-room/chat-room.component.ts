import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/core/services/websocket.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoomService } from 'src/app/core/services/room.service';
import { ChatMessage } from 'src/app/shared/models/chat-message';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  roomId: string | null = null;
  messages: ChatMessage[] = [];
  messageSubscription: Subscription | undefined;
  
  // Propiedades nuevas
  currentUser: string | null = null; 
  isLoadingHistory = true;

  messageControl = new FormControl('', [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private authService: AuthService, 
    private roomService: RoomService  
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.currentUser = decodedToken.sub;
    }

    this.roomId = this.route.snapshot.paramMap.get('roomId');
    
    if (this.roomId) {
      this.loadMessageHistory();

      this.webSocketService.initAndConnect();
      this.subscribeToRoomTopic();
    }
  }
  
  loadMessageHistory(): void {
    if (!this.roomId) return;
    this.isLoadingHistory = true;
    this.roomService.getRoomMessages(this.roomId).subscribe({
      next: (history) => {
        console.log("Historial de mensajes recibido del backend:", history);
        
        this.messages = history;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error("Error al cargar el historial de mensajes", err);
        this.isLoadingHistory = false;
      }
    });
  }

  subscribeToRoomTopic(): void {
    if (!this.roomId) return;
    this.messageSubscription = this.webSocketService
      .watchTopic(`/topic/rooms/${this.roomId}`)
      .subscribe((message: ChatMessage) => {
        this.messages.push(message);
      });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.webSocketService.deactivate();
  }

  sendMessage(): void {
    if (this.messageControl.invalid || !this.roomId) {
      return;
    }

    const messagePayload: Partial<ChatMessage> = {
      contenido: this.messageControl.value
    };

    this.webSocketService.publishMessage(`/app/chat.sendMessage/${this.roomId}`, messagePayload);
    this.messageControl.reset();
  }
}