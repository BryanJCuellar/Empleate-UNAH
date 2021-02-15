import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Components
import { StudentLoginComponent } from './pages/login/student-login/student-login.component';
import { StudentSignupComponent } from './pages/signup/student-signup/student-signup.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentLoginComponent,
    StudentSignupComponent,
    StudentHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
