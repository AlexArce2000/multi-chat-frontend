import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { Router, NavigationEnd } from '@angular/router'; // <-- IMPORTAR
import { Location } from '@angular/common'; // <-- IMPORTAR
import { filter } from 'rxjs/operators'; // <-- IMPORTAR

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-frontend';
  showBackButton = false; // Por defecto, no mostramos el botón

  constructor(
    private themeService: ThemeService,
    private router: Router,      // <-- INYECTAR
    private location: Location   // <-- INYECTAR
  ) {
    // Nos suscribimos a los eventos de navegación del router
    this.router.events.pipe(
      // Filtramos para quedarnos solo con el evento 'NavigationEnd',
      // que se dispara cuando la navegación ha terminado.
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Comprobamos la URL actual.
      // Si la URL es la raíz, el login o el registro, no mostramos el botón.
      if (event.url === '/login' || event.url === '/register' || event.url === '/chat') {
        this.showBackButton = false;
      } else {
        // Para cualquier otra ruta (como /chat/sala-123), sí lo mostramos.
        this.showBackButton = true;
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Método para navegar hacia atrás
  goBack(): void {
    this.location.back();
  }
}