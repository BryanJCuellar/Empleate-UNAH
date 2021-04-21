import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';
  io = io(this.backendHost, {
    withCredentials: true,
    autoConnect: false
  });
  constructor() { }
}
