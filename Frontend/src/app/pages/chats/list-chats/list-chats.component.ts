import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-chats',
  templateUrl: './list-chats.component.html',
  styleUrls: ['./list-chats.component.css']
})
export class ListChatsComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  id_usuario: any;
  tipo_usuario: any;
  mis_chats: any;
  log_estudiante: boolean;
  log_empresa: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
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
    localStorage.setItem('TIPO_USUARIO', this.tipo_usuario);
    // Cargar mis chats
    this.cargarMisChats();
  }

  getAuthService() {
    return this.authService;
  }

  irChat(idChat) {
    window.location.href = `${this.tipo_usuario}/${this.id_usuario}/chats/${idChat}`;
    // this.router.navigate([`${this.tipo_usuario}/${this.id_usuario}/chats/${idChat}`]);
  }

  cargarMisChats() {
    this.chatService.cargarMisChats(this.id_usuario, this.tipo_usuario)
      .subscribe(
        dataChats => {
          // console.log(dataChats);
          this.mis_chats = dataChats;
        },
        error => console.log(error)
      )
  }

  borrarChat(idChat) {
    Swal.fire({
      title: "¿Esta seguro de eliminar chat?",
      icon: 'warning',
      iconColor: '#E11A41',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#E11A41',
      cancelButtonColor: '#00A6F7',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.chatService.borrarChat(idChat)
          .subscribe(
            res => {
              console.log(res);
              this.cargarMisChats();
            },
            error => console.log(error)
          )
      }
    });
  }

  logOutStudent() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.authService.removeTokens();
          window.location.href = 'login/student';
        }
      })
  }

  logOutCompany() {
    this.authService.logoutCompany()
      .subscribe(success => {
        if (success) {
          this.authService.removeTokens();
          window.location.href = 'login/company';
        }
      })
  }
}
