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

  subirImagenPerfil(idEstudiante, dataImage): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/estudiantes/${idEstudiante}/imagenPerfil`, dataImage);
  }
}
