import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'register/student', component: RegistroComponent, data: { title: 'Empleate-UNAH - Registro Estudiante' } },
  { path: 'login', component: LoginComponent, data: { title: 'Empleate-UNAH - Login' } },
  { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
