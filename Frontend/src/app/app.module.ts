import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
// Pipes
import { FiltrarDeptoPipe } from './pipes/filtrar-depto.pipe';
import { FiltrarJornadaPipe } from './pipes/filtrar-jornada.pipe';
import { FiltrarPalabrasClavesPipe } from './pipes/filtrar-palabras-claves.pipe';
import { SafeurlPipe } from './pipes/safeurl.pipe';
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

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    StudentHomeComponent,
    LoginComponent,
    LoginEmpressComponent,
    RegistroEmpressComponent,
    PerfilEstudianteComponent,
    StudentProfileEditComponent,
    ProfileEmpresComponent,
    CompanyProfileEditComponent,
    VistaEstudianteComponent,
    FiltrarDeptoPipe,
    FiltrarJornadaPipe,
    SafeurlPipe,
    ListChatsComponent,
    ChatComponent,
    FiltrarPalabrasClavesPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule
  ],
  providers: [
    Title,
    AuthService,
    AuthStudentGuard,
    AuthCompanyGuard,
    AuthBothGuard,
    CheckLoginGuard,
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
