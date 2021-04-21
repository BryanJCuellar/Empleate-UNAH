import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroEmpressComponent } from './pages/registro-empress/registro-empress.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginEmpressComponent } from './pages/login-empress/login-empress.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { CompanyHomeComponent } from './pages/company-home/company-home.component';
import { PerfilEstudianteComponent } from './pages/perfil-estudiante/perfil-estudiante.component';
import { StudentProfileEditComponent } from './pages/student-profile-edit/student-profile-edit.component';
import { ProfileEmpresComponent } from './pages/profile-empres/profile-empres.component';
import { PostulacionComponent } from './pages/postulacion/postulacion.component';
import {CompanyProfileEditComponent} from './pages/company-profile-edit/company-profile-edit.component';
import { VistaEstudianteComponent } from './pages/vista-estudiante/vista-estudiante.component';
import { ListChatsComponent } from './pages/chats/list-chats/list-chats.component';
import { ChatComponent } from './pages/chats/chat/chat.component';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'register/company', component: RegistroEmpressComponent, data: { title: 'Empleate-UNAH - Registro Empresa' } },
  { path: 'login/student', component: LoginComponent, data: { title: 'Empleate-UNAH - Login Estudiante' } },
  { path: 'login/company', component: LoginEmpressComponent, data: { title: 'Empleate-UNAH - Login Empresa' } },
  { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - HOME-ESTUDIANTE' } },
  { path: 'student/profile', component: PerfilEstudianteComponent, data: { title: 'Empleate-UNAH - Perfil Estudiante' } },
  { path: 'student/profile/edit', component: StudentProfileEditComponent, data: { title: 'Empleate-UNAH - Editar Perfil Estudiante' } },
  { path: 'student/home/postulate', component: PostulacionComponent, data: { title: 'Empleate-UNAH - Postulate' } },
  { path: 'company/home', component: CompanyHomeComponent, data: { title: 'Empleate-UNAH - Inicio Empresa' } },
  { path: 'company/profile', component: ProfileEmpresComponent, data: { title: 'Empleate-UNAH - PERFIL-EMPRESA' } },
  { path: 'company/profile/edit', component: CompanyProfileEditComponent, data: { title: 'Empleate-UNAH - PERFIL-EMPRESA' } },
  { path: 'company/student-selected/:idEstudiante', component: VistaEstudianteComponent, data: { title: 'Empleate-UNAH - Perfil Estudiante' } },
  /**Chats**/
  { path: ':tipoUsuario/:idUsuario/chats', component: ListChatsComponent, data: { title: 'Empleate-UNAH - Mis Chats' } },
  { path: ':tipoUsuario/:idUsuario/chats/:idChat', component: ChatComponent, data: { title: 'Empleate-UNAH - Chat' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
