import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  /***Estudiantes***/
  // Login al registrar
  registrarEstudiante(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/signup`, data);
  }
  // Login
  loginEstudiante(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/login`, data);
  }

  /*Verificar login*/
  loggedIn(): boolean {
    if (localStorage.getItem('token') && localStorage.getItem('rol')) {
      return true;
    }
    return false;
  }

  loggedInStudent(): boolean {
    if (localStorage.getItem('token') && localStorage.getItem('rol') == 'Estudiante') {
      return true;
    }
    return false;
  }

  loggedInCompany(): boolean {
    if (localStorage.getItem('token') && localStorage.getItem('rol') == 'Empresa') {
      return true;
    }
    return false;
  }

  /*Cerrar Sesion*/
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    window.location.href = "/login";
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRol() {
    return localStorage.getItem('rol');
  }

}
