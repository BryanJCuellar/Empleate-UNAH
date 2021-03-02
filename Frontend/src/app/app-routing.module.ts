import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroEmpressComponent } from './pages/registro-empress/registro-empress.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginEmpressComponent } from './pages/login-empress/login-empress.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { CompanyHomeComponent } from './pages/company-home/company-home.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'register/company', component: RegistroEmpressComponent, data: { title: 'Empleate-UNAH - Registro Empresa' } },
  { path: 'login/student', component: LoginComponent, data: { title: 'Empleate-UNAH - Login Estudiante' } },
  { path: 'login/company', component: LoginEmpressComponent, data: { title: 'Empleate-UNAH - Login Empresa' } },
  { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } },
  { path: 'company/home', component: CompanyHomeComponent, data: { title: 'Empleate-UNAH - Inicio Empresa' } },
  { path: 'student/profile', component: StudentProfileComponent, data: { title: 'Empleate-UNAH - Perfil Estudiante' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
