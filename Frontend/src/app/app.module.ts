import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { StudentSignupComponent } from './pages/signup/student-signup/student-signup.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    AppComponent,
    StudentSignupComponent,
    StudentHomeComponent,
    LoginComponent,
    RegistroComponent,
    LandingComponent ,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
      { path: 'login', component: LoginComponent, data: { title: 'Empleate-UNAH - Login' } },
      { path: 'student/signup', component: StudentSignupComponent, data: { title: 'Empleate-UNAH - Registro Estudiante' } },
      { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } },
      { path: 'register/student', component: RegistroComponent }
  ])
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
