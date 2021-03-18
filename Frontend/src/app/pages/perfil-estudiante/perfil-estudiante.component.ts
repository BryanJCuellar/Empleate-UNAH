import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css']
})
export class PerfilEstudianteComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudiante: any;
  idEstudiante = '603b3cf672051918ac09a05e';
  constructor(private estudiantesService: EstudiantesService,  private authService: AuthService,) { }

  ngOnInit(): void {
   /* this.estudiantesService.obtenerIDEstudiante().subscribe(
      res=>{
        this.idEstudiante = res;
        console.log(this.idEstudiante);
      },
      error=>{
        console.log(error);
      }
    );
    this.estudiantesService.obtenerInfoPrincipalEstudiante(this.idEstudiante).subscribe(
      res=>{
        this.estudiante = res;
        console.log(this.estudiante);
      },
      error=>{
        console.log(error);
      }
    )*/
    if (this.authService.getRol() == 'Estudiante') {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.estudiantesService.obtenerInfoPrincipalEstudiante(res.id)
              .subscribe(
                data => {
                  // console.log(data);
                  this.estudiante = data;
                  console.log(this.estudiante);
                },
                error => console.log('Error al obtener informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }
  
  getAuthService() {
    return this.authService;
  }

}
