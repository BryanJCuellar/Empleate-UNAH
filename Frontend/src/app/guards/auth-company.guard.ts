import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCompanyGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }

  canActivate() {
    if(this.authService.loggedInCompany()){
      return true;
    }

    window.location.href = 'login/company';
    return false;
  }
  
}
