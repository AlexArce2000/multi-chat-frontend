import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- IMPORTAR Router
import { AuthService } from 'src/app/core/services/auth.service';
import { RoomService } from 'src/app/core/services/room.service';
import { Room } from 'src/app/shared/models/room'; 
import { MatDialog } from '@angular/material/dialog'; 
import { CreateRoomComponent } from 'src/app/shared/dialogs/create-room/create-room.component'; 
import { NotificationService } from 'src/app/core/services/notification.service';
import { JoinRoomComponent } from 'src/app/shared/dialogs/join-room/join-room.component';
import { JoinPrivateRoomComponent } from 'src/app/shared/dialogs/join-private-room/join-private-room.component';

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.scss']
})
export class ChatLobbyComponent implements OnInit { 
  public publicRooms: Room[] = [];
  public isLoading = true;

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
        console.log('Datos de salas recibidos del backend:', rooms);
        
        this.publicRooms = rooms;
        this.isLoading = false;
      },
      error: (err) => {
        // ...
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
      next: (newRoom: Room) => { // Tipamos la respuesta como Room
        this.notificationService.showSuccess(`¡Sala "${newRoom.name}" creada con éxito!`);
        this.router.navigate(['/chat', newRoom.id]);
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
  handleRoomClick(room: Room): void {
    if (room.public) {
      this.roomService.joinRoom(room.id).subscribe({
        next: () => {
          this.router.navigate(['/chat', room.id]);
        },
        error: (err) => {
          this.notificationService.showError('No se pudo unir a la sala pública.');
        }
      });
    } else {
      const dialogRef = this.dialog.open(JoinRoomComponent, {
        width: '400px',
        data: { roomName: room.name } // Pasamos datos al diálogo
      });

      dialogRef.afterClosed().subscribe(password => {
        if (password) {
          this.roomService.joinRoom(room.id, password).subscribe({
            next: () => {
              this.router.navigate(['/chat', room.id]);
            },
            error: (err) => {
              this.notificationService.showError(err.error || 'Contraseña incorrecta o error al unirse.');
            }
          });
        }
      });
    }
  }

  openJoinPrivateRoomDialog(): void {
    const dialogRef = this.dialog.open(JoinPrivateRoomComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' será un objeto { roomId: '...', password: '...' }
      if (result && result.roomId && result.password) {
        this.roomService.joinRoom(result.roomId, result.password).subscribe({
          next: () => {
            this.notificationService.showSuccess('Te has unido a la sala privada.');
            this.router.navigate(['/chat', result.roomId]);
          },
          error: (err) => {
            this.notificationService.showError(err.error || 'No se pudo unir. Verifica el ID y la contraseña.');
          }
        });
      }
    });
  }  
  logout(): void {
    this.authService.logout();
  }
}