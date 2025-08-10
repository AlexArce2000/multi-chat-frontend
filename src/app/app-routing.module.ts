import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatLobbyComponent } from './features/chat/chat-lobby/chat-lobby.component';
import { AuthGuard } from './core/guards/auth.guard';
const routes: Routes = [
    {
        path: 'chat',
        component: ChatLobbyComponent,
        canActivate: [AuthGuard] 
    },    
    {
        path: 'login', 
        component: LoginComponent 
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'     
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
