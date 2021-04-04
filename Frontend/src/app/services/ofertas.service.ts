import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  constructor(private httpClient: HttpClient) {
  }

  obtenerOfertasEmpresa(idEmpresa): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas/${idEmpresa}`, {});
  }

  obtenerOfertas(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas`, {});
  }
  
  guardarOferta(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/ofertas`, data);
  }
}
