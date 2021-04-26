import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroEmpressComponent } from './pages/registro-empress/registro-empress.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginEmpressComponent } from './pages/login-empress/login-empress.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { PerfilEstudianteComponent } from './pages/perfil-estudiante/perfil-estudiante.component';
import { StudentProfileEditComponent } from './pages/student-profile-edit/student-profile-edit.component';
import { ProfileEmpresComponent } from './pages/profile-empres/profile-empres.component';
import { CompanyProfileEditComponent } from './pages/company-profile-edit/company-profile-edit.component';
import { VistaEstudianteComponent } from './pages/vista-estudiante/vista-estudiante.component';
import { ListChatsComponent } from './pages/chats/list-chats/list-chats.component';
import { ChatComponent } from './pages/chats/chat/chat.component';
// Guards
import { AuthStudentGuard } from './guards/auth-student.guard';
import { AuthCompanyGuard } from './guards/auth-company.guard';
import { AuthBothGuard } from './guards/auth-both.guard';
import { CheckLoginGuard } from './guards/check-login.guard';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'register/company', component: RegistroEmpressComponent, canActivate: [CheckLoginGuard], data: { title: 'Empleate-UNAH - Registro Empresa' } },
  { path: 'login/student', component: LoginComponent, canActivate: [CheckLoginGuard], data: { title: 'Empleate-UNAH - Login Estudiante' } },
  { path: 'login/company', component: LoginEmpressComponent, canActivate: [CheckLoginGuard], data: { title: 'Empleate-UNAH - Login Empresa' } },
  { path: 'student/home', component: StudentHomeComponent, canActivate: [AuthStudentGuard], data: { title: 'Empleate-UNAH - HOME-ESTUDIANTE' } },
  { path: 'student/profile', component: PerfilEstudianteComponent, canActivate: [AuthStudentGuard], data: { title: 'Empleate-UNAH - PERFIL-ESTUDIANTE' } },
  { path: 'student/profile/edit', component: StudentProfileEditComponent, canActivate: [AuthStudentGuard], data: { title: 'Empleate-UNAH - PERFIL-ESTUDIANTE' } },
  { path: 'company/profile', component: ProfileEmpresComponent, canActivate: [AuthCompanyGuard], data: { title: 'Empleate-UNAH - PERFIL-EMPRESA' } },
  { path: 'company/profile/edit', component: CompanyProfileEditComponent, canActivate: [AuthCompanyGuard], data: { title: 'Empleate-UNAH - PERFIL-EMPRESA' } },
  { path: 'company/student-selected/:idEstudiante', component: VistaEstudianteComponent, canActivate: [AuthCompanyGuard], data: { title: 'Empleate-UNAH - PERFIL-ESTUDIANTE' } },
  /**Chats**/
  { path: ':tipoUsuario/:idUsuario/chats', component: ListChatsComponent, canActivate: [AuthBothGuard], data: { title: 'Empleate-UNAH - Mis Chats' } },
  { path: ':tipoUsuario/:idUsuario/chats/:idChat', component: ChatComponent, canActivate: [AuthBothGuard], data: { title: 'Empleate-UNAH - Chat' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
