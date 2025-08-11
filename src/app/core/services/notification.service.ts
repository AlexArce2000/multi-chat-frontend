import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar,
  ) { }

  /**
   * Muestra una notificación de éxito (verde).
   * @param message El mensaje a mostrar.
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success'] 
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, 
      panelClass: ['snackbar-error'] 
    });
  }
  showSuccessWithAction(message: string, actionText: string, onAction: () => void): void {
    const snackBarRef = this.snackBar.open(message, actionText, {
      duration: 10000,
      panelClass: ['snackbar-success']
    });

    snackBarRef.onAction().subscribe(() => {
      onAction();
    });
  }
  copyToClipboard(text: string, confirmationMessage: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess(confirmationMessage);
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
      this.showError('No se pudo copiar el texto.');
    });
  } 
}