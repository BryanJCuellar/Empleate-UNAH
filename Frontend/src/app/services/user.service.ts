import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8888/estudiantes';
  // private url = url de atlas
  constructor(
    private http:HttpClient
  ) {
   }
   userLogin(userData: any):Observable<any>{
     return this.http.post(`${this.url}/login`, userData);
   }
}
