import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';
  idOferta: any;

  constructor(private httpClient: HttpClient) {
  }

  obtenerOfertasEmpresa(idEmpresa): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas/empresa/${idEmpresa}`, {});
  }

  obtenerOfertas(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas`, {});
  }

  obtenerPostulacionesOferta(idOferta): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas/${idOferta}/postulaciones`, {});
  }

  guardarOferta(data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/ofertas`, data);
  }

  actualizarOferta(idOferta, data): Observable<any> {
    return this.httpClient.put(`${this.backendHost}/ofertas/${idOferta}`, data);
  }

  archivarOferta(idOferta): Observable<any> {
    return this.httpClient.put(`${this.backendHost}/ofertas/${idOferta}/estado`, { estado_oferta: false });
  }

  restaurarOferta(idOferta): Observable<any> {
    return this.httpClient.put(`${this.backendHost}/ofertas/${idOferta}/estado`, { estado_oferta: true });
  }

  borrarOferta(idOferta): Observable<any> {
    return this.httpClient.delete(`${this.backendHost}/ofertas/${idOferta}`);
  }

  agregarPostulacionOferta(idOferta, data): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/ofertas/${idOferta}/postulaciones`, data);
  }
  obtenerOfertaSelccionada(idOferta): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/ofertas/${idOferta}`, {});
  }

  seleccionarOferta(idOferta){
    this.idOferta = idOferta;
  }

  getIdOferta(){
    return this.idOferta;
  }

}


