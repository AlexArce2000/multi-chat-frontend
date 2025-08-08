import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // La URL base de nuestro backend
  private apiUrl = 'http://localhost:8080/api/auth';

  // Inyectamos el HttpClient
  constructor(private http: HttpClient) { }

  // Método para el registro.
  // Acepta un objeto con 'username' y 'password'.
  // Devuelve un Observable, que es como Angular maneja las operaciones asíncronas.
  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  // Más tarde añadiremos los métodos login() y logout() aquí
}