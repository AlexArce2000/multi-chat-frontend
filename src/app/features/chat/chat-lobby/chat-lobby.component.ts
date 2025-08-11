import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- IMPORTAR Router
import { AuthService } from 'src/app/core/services/auth.service';
import { RoomService } from 'src/app/core/services/room.service';
import { Room } from 'src/app/shared/models/room'; 
import { MatDialog } from '@angular/material/dialog'; 
import { CreateRoomComponent } from 'src/app/shared/dialogs/create-room/create-room.component'; 
import { NotificationService } from 'src/app/core/services/notification.service';

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
    private router: Router,
    public dialog: MatDialog,
    private notificationService: NotificationService
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
        this.notificationService.showError('No se pudieron cargar las salas.');
        console.error('Error al cargar las salas públicas:', err);
        this.isLoading = false;
      }
    });
  }
  openCreateRoomDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '450px', 
      disableClose: true
    });

    // Nos suscribimos al resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createRoom(result);
      }
    });
  }
  createRoom(roomData: any): void {
    this.roomService.createRoom(roomData).subscribe({
      next: (newRoom) => {
        this.notificationService.showSuccess(`¡Sala "${newRoom.name}" creada con éxito!`);
        // Refrescamos la lista para que la nueva sala aparezca si es pública
        this.loadPublicRooms();
      },
      error: (err) => {
        this.notificationService.showError('Error al crear la sala.');
      }
    });
  }

  joinRoom(roomId: string): void {
    console.log(`Intentando unirse a la sala: ${roomId}`);
    
    this.roomService.joinRoom(roomId).subscribe({
      next: (response) => {
        console.log('Unido a la sala con éxito:', response);
        this.router.navigate(['/chat', roomId]);
      },
      error: (err) => {
        console.error('Error al unirse a la sala:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}