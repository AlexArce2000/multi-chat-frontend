import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- IMPORTAR Router
import { AuthService } from 'src/app/core/services/auth.service';
import { RoomService } from 'src/app/core/services/room.service';
import { Room } from 'src/app/shared/models/room'; 

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.scss']
})
export class ChatLobbyComponent implements OnInit { 
  public publicRooms: Room[] = [];
  public isLoading = true;

  // Inyectamos RoomService y Router
  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPublicRooms();
  }

  loadPublicRooms(): void {
    this.isLoading = true;
    this.roomService.getPublicRooms().subscribe({
      next: (rooms) => {
        this.publicRooms = rooms;
        this.isLoading = false;
        console.log('Salas públicas cargadas:', rooms);
      },
      error: (err) => {
        console.error('Error al cargar las salas públicas:', err);
        this.isLoading = false;
      }
    });
  }

  joinRoom(roomId: string): void {
    this.router.navigate(['/chat', roomId]);
  }

  logout(): void {
    this.authService.logout();
  }
}