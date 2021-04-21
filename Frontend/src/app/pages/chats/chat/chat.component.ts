import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatHistory') private myScrollContainer: ElementRef;
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  chat_actual: any;
  mensajes: any;
  userChat = {
    idChat: '',
    idEstudiante: '',
    idEmpresa: '',
    from: '',
    text: ''
  };
  id_chat: any;
  id_usuario: any;
  tipo_usuario: any;
  log_estudiante: boolean = false;
  log_empresa: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private chatService: ChatService
  ) {
    // Conectar socket
    this.chatService.connect();
    this.id_chat = this.activatedRoute.snapshot.params.idChat;
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.id_usuario = this.activatedRoute.snapshot.params.idUsuario;
    this.tipo_usuario = this.activatedRoute.snapshot.params.tipoUsuario;
    if (this.tipo_usuario == 'student') {
      this.log_estudiante = true;
      this.log_empresa = false;
    }
    if (this.tipo_usuario == 'company') {
      this.log_estudiante = false;
      this.log_empresa = true;
    }
    this.userChat.idChat = this.id_chat;
    this.userChat.from = this.id_usuario;
    this.chatService.llamarMensajes(this.id_chat);
    this.chatService.listen()
      .subscribe(
        dataMessages => {
          console.log(dataMessages);
          this.mensajes = dataMessages;
        },
        error => console.log(error)
      )
    this.chatService.cargarChat(this.id_chat, this.tipo_usuario)
      .subscribe(
        dataChat => {
          console.log(dataChat);
          this.chat_actual = dataChat;
          this.userChat.idEstudiante = this.chat_actual.id_estudiante;
          this.userChat.idEmpresa = this.chat_actual.id_empresa;
        },
        error => console.log(error)
      );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  submitMessage(event) {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.userChat.text != '') {
      this.chatService.sendMessage(this.userChat);
      this.userChat.text = '';
    }
  }

  getAuthService() {
    return this.authService;
  }

  redireccionarAHome() {
    this.chatService.disconnect(this.id_chat);
    if (this.tipo_usuario == 'student') {
      this.router.navigate([`/${this.tipo_usuario}/home`]);
    }
    if (this.tipo_usuario == 'company') {
      this.router.navigate([`/${this.tipo_usuario}/profile`]);
    }
  }

  redireccionarAMensajes() {
    this.chatService.disconnect(this.id_chat);
    this.router.navigate([`/${this.tipo_usuario}/${this.id_usuario}/chats`]);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect(this.id_chat);
  }

}
