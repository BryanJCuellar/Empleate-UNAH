import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  estudianteActual: any;

  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private OfertasService : OfertasService
  ) { }

  ngOnInit(): void {
    // Estudiantes
    if (this.authService.getRol() == 'Estudiante') {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.estudiantesService.obtenerInfoPrincipalEstudiante(res.id)
              .subscribe(
                data => {
                  // console.log(data);
                  this.estudianteActual = data;
                  this.obtenerOfertas();
                },
                error => console.log('Error al obtener informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }

  obtenerOfertas(){
   // console.log('Error al obtener informacion estudiante', error)
   this.OfertasService.obtenerOfertas()
   .subscribe(
   res => {   
     console.log(res);
   },
   error => console.log('error al obterner ofertas', error)
   )
  }

  getAuthService() {
    return this.authService;
  }

}
