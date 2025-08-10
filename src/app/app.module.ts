import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatLobbyComponent } from './features/chat/chat-lobby/chat-lobby.component';
import { ChatRoomComponent } from './features/chat/chat-room/chat-room.component';
import { CreateRoomComponent } from './shared/dialogs/create-room/create-room.component';
@NgModule({
  // ¡DECLARA TODOS TUS COMPONENTES AQUÍ!
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatLobbyComponent,
    ChatRoomComponent,
    CreateRoomComponent // <-- LA DECLARACIÓN QUE FALTABA
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule // <-- Al importar esto, tenemos acceso a todos los componentes de Material
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }