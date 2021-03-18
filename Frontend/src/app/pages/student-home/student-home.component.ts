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
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudianteActual: any;
  ofertas: any;
  closeResult = '';
  elegir='home';
  color1 = "#520547";
  color2 = "#520547";
  color3 = "#520547";
  color4 = "#520547";
  color5 = "#520547";

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
     console.log("Ofertas", res);
     // console.log(res[0].empresa[0].imagenPerfil);
     this.ofertas = res;
   },
   error => console.log('Error al obterner ofertas', error)
   )
  }

  getAuthService() {
    return this.authService;
  }
  
  home(){
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir='home';
    this.color1 = '#854A7C';
  }
  Mis_Postulaciones(){
    this.color1 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir='Mis_Postulaciones';
    this.color2 = '#854A7C';
  }
  Buscar_Ofertas(){
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir='Buscar_Ofertas';
    this.color3 = '#854A7C';
  }

  
  Mi_Curriculum(){
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color5 = "#520547";
    this.elegir='Mi_Curriculum';
    this.color4 = '#854A7C';
  }

  Configuracion(){
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.elegir='Configuracion';
    this.color5 = '#854A7C';
  }

}
