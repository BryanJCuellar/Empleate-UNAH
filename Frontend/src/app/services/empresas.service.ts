import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  obtenerIDEmpresa(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/empresas/tokenID`, {});
  }

  obtenerInfoPrincipalEmpresa(idEmpresa): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/empresas/${idEmpresa}`, {});
  }
}
