import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { StudentSignupComponent } from './pages/signup/student-signup/student-signup.component';
import { StudentLoginComponent } from './pages/login/student-login/student-login.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
const routes: Routes = [
  {
    path: '', component: LandingComponent
  },
  /*{ path: 'home', component: HomeComponent, data: { title: 'Empleate-UNAH - Inicio' } },*/
  { path: 'login/student', component: StudentLoginComponent, data: { title: 'Empleate-UNAH - Login Estudiante' } },
  { path: 'signup/student', component: StudentSignupComponent, data: { title: 'Empleate-UNAH - Registro Estudiante' } },
  { path: 'home/student', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
