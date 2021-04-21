import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  backendHost: string = 'http://localhost:8888';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com';

  constructor(
    private socket: WebSocketService,
    private httpClient: HttpClient
  ) {
    this.listen();
  }

  // Conectar con socket.io-client
  connect() {
    this.socket.io.open();
  }

  // Se envia idChat para unirse a un room con el id
  llamarMensajes(idChat: any) {
    this.socket.io.emit("load-messages", {
      idChat: idChat
    });
  }

  // Crea chat si no ha sido creado
  irChat(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/chats`, data);
  }

  cargarMisChats(idUsuario: any, tipoUsuario: any): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/chats/${tipoUsuario}/misChats/${idUsuario}`, {});
  }

  cargarChat(idChat: any, tipoUsuario: any): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/chats/${idChat}/${tipoUsuario}`, {});
  }

  borrarChat(idChat: any): Observable<any> {
    return this.httpClient.delete(`${this.backendHost}/chats/${idChat}`);
  }

  // Estar a la escucha de recibo de mensajes de chat
  listen() {
    let observable = new Observable((Subscriber) => {
      this.socket.io.on("receive-messages", (data) => {
        Subscriber.next(data);
      })
    })
    return observable;
  }

  sendMessage(data: any) {
    this.socket.io.emit("send-message", data);
  }

  // Se envia idChat para abandonar el room con el id
  disconnect(idChat) {
    this.socket.io.emit("Disconnect", {
      idChat: idChat
    });
    this.socket.io.close();
  }
}
