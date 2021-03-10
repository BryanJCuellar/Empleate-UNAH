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

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'register/company', component: RegistroEmpressComponent, data: { title: 'Empleate-UNAH - Registro Empresa' } },
  { path: 'login/student', component: LoginComponent, data: { title: 'Empleate-UNAH - Login Estudiante' } },
  { path: 'login/company', component: LoginEmpressComponent, data: { title: 'Empleate-UNAH - Login Empresa' } },
  { path: 'student/profile', component: PerfilEstudianteComponent, data: { title: 'Empleate-UNAH - Perfil Estudiante' } },
  { path: 'company/home', component: CompanyHomeComponent, data: { title: 'Empleate-UNAH - Inicio Empresa' } },
  { path: 'student/profile/edit', component: StudentProfileEditComponent, data: { title: 'Empleate-UNAH - Editar Perfil Estudiante' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
