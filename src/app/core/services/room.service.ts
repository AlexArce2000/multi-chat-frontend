import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from 'src/app/shared/models/room';
import { ChatMessage } from 'src/app/shared/models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/api/v1/rooms';

  constructor(private http: HttpClient) { }

  getPublicRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/public`);
  }
  getRoomMessages(roomId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/${roomId}/messages`);
  }

  createRoom(roomData: { name: string, isPublic: boolean, password?: string }): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, roomData);
  } 
  joinRoom(roomId: string, password?: string): Observable<any> {
    const payload = password ? { password } : {};
    return this.http.post(`${this.apiUrl}/${roomId}/join`, payload, { responseType: 'text' });
  }
  getMyRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/my-rooms`);
  }  
}