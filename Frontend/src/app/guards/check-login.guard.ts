import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }

  canActivate() {
    // Si existe una sesion evitar que el usuario acceda a registro o login
    if (!this.authService.loggedIn()) {
      return true;
    }

    if(this.authService.loggedInStudent()){
      window.location.href = 'student/home';
    }

    if(this.authService.loggedInCompany()){
      window.location.href = 'company/profile';
    }
    
    return false;
  }

}
