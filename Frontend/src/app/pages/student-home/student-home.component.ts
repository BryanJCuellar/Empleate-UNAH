import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudianteActual: any;
  ofertaActual: any;
  aggregatePostulaciones = [];
  ofertas = [];
  closeResult = '';
  elegir = 'home';
  color1 = "#520547";
  color2 = "#520547";
  color3 = "#520547";
  color4 = "#520547";
  color5 = "#520547";



  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private OfertasService: OfertasService,
    private router: Router,
    private modalService: NgbModal,
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

  obtenerOfertas() {
    // console.log('Error al obtener informacion estudiante', error)
    this.OfertasService.obtenerOfertas()
      .subscribe(
        res => {
          // console.log("Ofertas", res);
          // console.log(res[0].empresa[0].imagenPerfil);
          for (let i = 0; i < res.length; i++) {
            this.ofertas.push(res[i]);
            if (res[i].descripcion.length > 50) {
              this.ofertas[i].resumenDescripcion = (res[i].descripcion).substring(0, 49) + '...';
            } else {
              this.ofertas[i].resumenDescripcion = res[i].descripcion;
            }
          }
          console.log("Ofertas", this.ofertas);
        },
        error => console.log('Error al obtener ofertas', error)
      )
  }

  getAuthService() {
    return this.authService;
  }

  cargarPostulaciones(){
    if(this.estudianteActual != null){
      this.estudiantesService.obtenerPostulacionesEstudiante(this.estudianteActual._id)
      .subscribe(
        response => {
          this.aggregatePostulaciones = [];
          for(let i = 0; i < response.length; i++){
            this.aggregatePostulaciones.push(response[i]);
            if (response[i].oferta.descripcion.length > 50) {
              this.aggregatePostulaciones[i].oferta.resumenDescripcion = (response[i].oferta.descripcion).substring(0, 49) + '...';
            } else {
              this.aggregatePostulaciones[i].oferta.resumenDescripcion = response[i].oferta.descripcion;
            }
          }
          console.log("Postulaciones", this.aggregatePostulaciones);
        },
        error => console.log('Error al obtener postulaciones', error)
      )
    }
  }


  home() {
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir = 'home';
    this.color1 = '#854A7C';
  }
  Mis_Postulaciones() {
    this.color1 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir = 'Mis_Postulaciones';
    this.color2 = '#854A7C';
    this.cargarPostulaciones();
  }
  Buscar_Ofertas() {
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color4 = "#520547";
    this.color5 = "#520547";
    this.elegir = 'Buscar_Ofertas';
    this.color3 = '#854A7C';
  }


  Mi_Curriculum() {
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color5 = "#520547";
    this.elegir = 'Mi_Curriculum';
    this.color4 = '#854A7C';
  }

  Configuracion() {
    this.color1 = "#520547";
    this.color2 = "#520547";
    this.color3 = "#520547";
    this.color4 = "#520547";
    this.elegir = 'Configuracion';
    this.color5 = '#854A7C';
  }

  seleccionarOferta(idOferta){
    console.log(idOferta);
    this.OfertasService.seleccionarOferta(idOferta);
    this.router.navigateByUrl(`/student/home/postulate`);
  }

  verDetalleOferta(idOferta){
    this.OfertasService.obtenerOfertaSelccionada(idOferta)
    .subscribe(
      data => {
        console.log(data);
        this.ofertaActual = data;
      },
      error => console.log('Error al obtener informacion oferta', error)
    );
  }

  open(content, idOferta) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.verDetalleOferta(idOferta);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
