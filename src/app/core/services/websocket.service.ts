import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends RxStomp {

  constructor(private authService: AuthService) {
    super(); 
  }

  public initAndConnect() {
    if (this.active) {
      return;
    }
    const token = this.authService.getToken();
    if (!token) {
      console.error('No JWT token found, connection aborted.');
      return;
    }

    this.configure({
      brokerURL: 'ws://localhost:8080/ws',

      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      },
      
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.activate();
  }

  /**
   * Se suscribe a un topic y devuelve un Observable con los mensajes.
   * @param topic El destino al que suscribirse (ej: /topic/rooms/123)
   */
  public watchTopic(topic: string): Observable<any> {
    return this.watch(topic).pipe(
      // Los mensajes llegan como un objeto IMessage, extraemos el body y lo parseamos
      map((message: IMessage) => {
        return JSON.parse(message.body);
      })
    );
  }

  /**
   * Publica (envía) un mensaje a un destino.
   * @param destination El destino al que enviar 
   * @param body El cuerpo del mensaje como un objeto JavaScript
   */
  public publishMessage(destination: string, body: any): void {
    this.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  }
}