import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStudentGuard implements CanActivate {
  
  constructor(
    private authService: AuthService
  ) { }

  canActivate() {
    if(this.authService.loggedInStudent()){
      return true;
    }

    window.location.href = 'login/student';
    return false;
  }

}
