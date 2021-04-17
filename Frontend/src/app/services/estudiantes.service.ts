import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  obtenerIDEstudiante(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/estudiantes/tokenID`, {});
  }

  obtenerInfoPrincipalEstudiante(idEstudiante): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/estudiantes/${idEstudiante}/main`, {});
  }

  obtenerEstudiante(idEstudiante): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/estudiantes/${idEstudiante}`, {});
  }

  obtenerEstudiantes(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/estudiantes`, {});
  }

  actualizarPerfilEstudiante(idEstudiante, data): Observable<any> {
    return this.httpClient.put(`${this.backendHost}/estudiantes/${idEstudiante}`, data);
  }

  subirImagenPerfil(idEstudiante, dataImage): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/${idEstudiante}/imagenPerfil`, dataImage);
  }

  subirCV(idEstudiante, dataCV): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/${idEstudiante}/CV`, dataCV);
  }

  agregarPostulacionEstudiante(idEstudiante, postulacion): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/${idEstudiante}/postulaciones`, postulacion);
  }

  obtenerPostulacionesEstudiante(idEstudiante): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/estudiantes/${idEstudiante}/postulaciones`, {});
  }

}
