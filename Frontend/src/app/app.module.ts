import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
// Components
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegistroComponent,
    StudentHomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
      { path: 'register/student', component: RegistroComponent, data: { title: 'Empleate-UNAH - Registro Estudiante' } },
      { path: 'login', component: LoginComponent, data: { title: 'Empleate-UNAH - Login' } },
      { path: 'student/home', component: StudentHomeComponent, data: { title: 'Empleate-UNAH - Inicio Estudiante' } }
    ])
  ],
  providers: [
    Title,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
