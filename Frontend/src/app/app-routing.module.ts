import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { StudentSignupComponent } from './pages/signup/student-signup/student-signup.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
  { path: 'login', component: LoginComponent, data: { title: 'Empleate-UNAH - Login' } },
  { path: 'student/signup', component: StudentSignupComponent, data: { title: 'Empleate-UNAH - Registro Estudiante' } },
  { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
