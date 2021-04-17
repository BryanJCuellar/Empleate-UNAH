import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OfertasService } from 'src/app/services/ofertas.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrls: ['./postulacion.component.css']
})
export class PostulacionComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';

  oferta: any;
  postulacionEstudiante: FormGroup;
  idOferta: any;
  estudiante: any;
  date = new Date();
  postulacionOferta: FormGroup;
  dia = this.date.getDate();
  mes = this.date.getMonth() + 1;
  anio = this.date.getFullYear();
  idEstudiante: any;


  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private OfertasService: OfertasService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.obtenerOferta();
    this.OfertasService.obtenerOfertaSelccionada(this.idOferta)
    .subscribe(
      data => {
        console.log(data);
        this.oferta = data;
      },
      error => console.log('Error al obtener informacion oferta', error)
    );
    if (this.authService.getRol() == 'Estudiante') {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.idEstudiante = res.id;
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

  obtenerOferta(){
    this.idOferta = this.OfertasService.getIdOferta();
    console.log(this.idOferta);
  }

  
  enviarPostulacion(): void {
    const formEditData = {
      id_oferta: this.idOferta,
      dia: this.dia,
      mes: this.mes,
      anio: this.anio
    };
    const formOferta = {
      id_estudiante: this.idEstudiante,
      dia: this.dia,
      mes: this.mes,
      anio: this.anio
    };
    if (this.authService.getRol() == 'Estudiante' && this.authService.loggedInStudent()) {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.estudiantesService.agregarPostulacionEstudiante(res.id, formEditData)
              .subscribe(
                success => {
                  this.OfertasService.agregarPostulacionOferta(this.idOferta, formOferta).
                   subscribe(
                     success => {
                      console.log(success);
                      // Mensaje success
                      Swal.fire({
                        title: 'Postulación realizada con éxito',
                        icon: 'success',
                        showConfirmButton: true
                      }).then(success => {
                        window.location.href = 'student/home';
                      }
                      ).catch(err => console.log(err));
                     },
                     error =>console.log('Error al actualizar oferta', error)
                   )
                },
                error => console.log('Error al actualizar informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
    

  }
  


}
