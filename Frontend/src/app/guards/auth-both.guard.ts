import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBothGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }

  canActivate() {
    if (this.authService.loggedIn()) {
      return true;
    }

    if (localStorage.getItem('TIPO_USUARIO') == 'student') {
      window.location.href = 'login/student';
    } else if (localStorage.getItem('TIPO_USUARIO') == 'company') {
      window.location.href = 'login/company';
    } else {
      window.location.href = '/home';
    }
    return false;
  }


}
