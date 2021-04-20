import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { EmpresasService } from 'src/app/services/empresas.service';

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.css']
})
export class VistaEstudianteComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudiante: any;
  idEstudianteSeleccionado:any;
  constructor(private estudiantesService: EstudiantesService,  private authService: AuthService,
    private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.obtenerEstudiante();
    this.estudiantesService.obtenerPerfilEstudiante(this.idEstudianteSeleccionado).subscribe(
      res=>{
        console.log(res);
        this.estudiante= res;
      },
      error=>{
        console.log('Error al obtener informacion estudiante', error)
      }
    )
  }
  obtenerEstudiante(){
    this.idEstudianteSeleccionado = this.empresasService.getEstudiante();
  }
  getAuthService() {
    return this.authService;
  }
}