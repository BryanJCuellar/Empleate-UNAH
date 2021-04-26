import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.css']
})
export class VistaEstudianteComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudiante: any;
  idEstudianteSeleccionado: any;
  idEmpresa: any;
  url: any;
  vista = "perfil";
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private estudiantesService: EstudiantesService,
    private authService: AuthService,
    private empresasService: EmpresasService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.idEstudianteSeleccionado = this.activatedRoute.snapshot.params.idEstudiante;
    if (this.authService.getRol() == 'Empresa') {
      this.empresasService.obtenerIDEmpresa()
        .subscribe(
          res => {
            this.idEmpresa = res.id;
          },
          error => console.log('Error al obtener ID', error)
        )
    }
    this.estudiantesService.obtenerPerfilEstudiante(this.idEstudianteSeleccionado).subscribe(
      res => {
        // console.log(res);
        this.estudiante = res;
      },
      error => {
        console.log('Error al obtener informacion estudiante', error)
      }
    )
  }

  irChat() {
    const dataEnviar = {
      id_estudiante: this.idEstudianteSeleccionado,
      id_empresa: this.idEmpresa
    }
    this.chatService.irChat(dataEnviar)
    .subscribe(
      res => {
        console.log(res);
        this.router.navigate([`company/${this.idEmpresa}/chats/${res.data._id}`]);
      }
    )
  }

  obtenerEstudiante() {
    this.idEstudianteSeleccionado = this.empresasService.getEstudiante();
  }
  getAuthService() {
    return this.authService;
  }
  verCurriculo() {
    this.vista = "curriculum";
    console.log(this.vista);
  }
  verPerfil() {
    this.vista = "perfil";
    console.log(this.vista);
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
