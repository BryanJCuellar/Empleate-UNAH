import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';
  idEstudiante: any;

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
  
  actualizarPerfilEmpresa(idEmpresa, data): Observable<any>{
    return this.httpClient.put(`${this.backendHost}/empresas/${idEmpresa}`, data);
  }

  subirImagenPerfil(idEmpresa, dataImage): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/empresas/${idEmpresa}/imagenPerfil`, dataImage);
  } 
  seleccionarEstudiante(estudiante_seleccionado){
    this.idEstudiante = estudiante_seleccionado;
    localStorage.setItem("estudiante", this.idEstudiante);
  }
  getEstudiante(){
    return localStorage.getItem('estudiante');
  }
}
