import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Tokens } from '../models/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly ROL = 'ROL';

  constructor(private httpClient: HttpClient) { }

  /***Estudiantes***/
  // Login
  loginEstudiante(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/login`, data);
  }

  /***Empresas***/
  // Login
  loginEmpresa(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/login`, data);
  }
  /*Registro Empresa*/
  // Validar si email ya existe
  validateEmailRegister(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/signup/validateEmail`, data);
  }
  // Send Mail Verification
  sendMailRegister(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/signup/send-email/verify`, data);
  }
  // Registrar una vez verificado el correo
  registrarEmpresa(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/signup`, data);
  }

  /*Verificar login*/
  loggedIn(): boolean {
    if (this.getJwtToken() && this.getRol()) {
      return true;
    }
    return false;
  }

  loggedInStudent(): boolean {
    if (this.getJwtToken() && this.getRol() == 'Estudiante') {
      return true;
    }
    return false;
  }

  loggedInCompany(): boolean {
    if (this.getJwtToken() && this.getRol() == 'Empresa') {
      return true;
    }
    return false;
  }

  // Refresh token
  refreshToken() {
    // Estudiante
    if (this.loggedInStudent()) {
      return this.httpClient.post(`${this.backendHost}/estudiantes/refresh`, {
        refreshToken: this.getRefreshToken()
      }).pipe(tap((tokens: Tokens) => {
        this.storeJwtToken(tokens.jwt);
      }));
    }
    // Empresa
    if (this.loggedInCompany()) {
      return this.httpClient.post(`${this.backendHost}/empresas/refresh`, {
        refreshToken: this.getRefreshToken()
      }).pipe(tap((tokens: Tokens) => {
        this.storeJwtToken(tokens.jwt);
      }));
    }
  }

  /*Cerrar Sesion*/
  logout(): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/logout`, {
      refreshToken: this.getRefreshToken()
    });
  }

  logoutCompany(): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/logout`, {
      refreshToken: this.getRefreshToken()
    });
  }

  // Gestion de tokens
  storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(this.ROL, tokens.rol);
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getRol() {
    return localStorage.getItem(this.ROL);
  }

  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.ROL);
  }

}
