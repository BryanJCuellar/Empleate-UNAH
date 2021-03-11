import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
import { RegistroEmpressComponent } from './pages/registro-empress/registro-empress.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginEmpressComponent } from './pages/login-empress/login-empress.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { CompanyHomeComponent } from './pages/company-home/company-home.component';
import { RouterModule } from '@angular/router';
import { PerfilEstudianteComponent } from './pages/perfil-estudiante/perfil-estudiante.component';
import { StudentProfileEditComponent } from './pages/student-profile-edit/student-profile-edit.component';
import { ProfileEmpresComponent } from './pages/profile-empres/profile-empres.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    StudentHomeComponent,
    LoginComponent,
    LoginEmpressComponent,
    RegistroEmpressComponent,
    CompanyHomeComponent,
    PerfilEstudianteComponent,
    StudentProfileEditComponent,
    ProfileEmpresComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: '', component: LandingComponent, data: { title: 'Empleate-UNAH' } },
      { path: 'register/company', component: RegistroEmpressComponent, data: { title: 'Empleate-UNAH - Registro Empresa' } },
      { path: 'login/student', component: LoginComponent, data: { title: 'Empleate-UNAH - Login Estudiante' } },
      { path: 'login/company', component: LoginEmpressComponent, data: { title: 'Empleate-UNAH - Login Empresa' } },
      { path: 'student/profile', component: PerfilEstudianteComponent, data: { title: 'Empleate-UNAH - Perfil Estudiante' } },
      { path: 'company/home', component: CompanyHomeComponent, data: { title: 'Empleate-UNAH - Inicio Empresa' } },
      { path: 'student/profile/edit', component: StudentProfileEditComponent, data: { title: 'Empleate-UNAH - Editar Perfil Estudiante' } },
      { path: 'company/profile', component: ProfileEmpresComponent, data: { title: 'Empleate-UNAH - PERFIL-EMPRESA' } }
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
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
