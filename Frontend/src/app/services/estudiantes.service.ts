import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  
  constructor(private httpClient: HttpClient) { }
}
