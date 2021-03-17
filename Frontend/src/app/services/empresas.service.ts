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

  obtenerEmpresa(idEmpresa): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/empresas/${idEmpresa}`, {});
  }

  obtenerEmpresas(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/empresas`, {});
  }
  // Guardar id de Oferta en el campo ofertas de Empresa
  guardarIDOfertaEmpresa(idEmpresa, idOferta): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/${idEmpresa}/ofertas`,
      {
        id_oferta: idOferta
      });
  }
}
