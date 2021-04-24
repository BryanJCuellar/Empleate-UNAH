import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
  
})
export class StudentHomeComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  estudianteActual: any;
  ofertaActual: any;
  aggregatePostulaciones = [];
  ofertas = [];
  departamento: any;
  jornada: any;
  departamentos: any = ['Atlántida', 'Colón', 'Comayagua', 'Copán', 'Cortés', 'Choluteca', 'El Paraíso',
    'Francisco Morazán', 'Gracias a Dios', 'Intibucá', 'Islas de Bahía', 'La Paz', 'Lempira', 'Ocotepeque',
    'Olancho', 'Santa Bárbara', 'Valle', 'Yoro'];
  jornada_laboral: any = ['Tiempo Completo', 'Desde Casa', 'Por Horas', 'Medio Tiempo',
    'Beca/Prácticas', 'No Especificar (N/A)'];
  palabrasClaves = '';
  closeResult = '';
  elegir = 'home';
  color1 = "#00A6F7";
  color2 = "#191140";
  color3 = "#191140";
  color4 = "#191140";
  color5 = "#191140";
  date = new Date();
  dia = this.date.getDate();
  mes = this.date.getMonth() + 1;
  anio = this.date.getFullYear();



  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private OfertasService: OfertasService,
    private router: Router,
    private modalService: NgbModal
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
                  console.log(data);
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

  irMensajes(idUsuario) {
    window.location.href = `student/${idUsuario}/chats`;
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

  cargarPostulaciones() {
    if (this.estudianteActual != null) {
      this.estudiantesService.obtenerPostulacionesEstudiante(this.estudianteActual._id)
        .subscribe(
          response => {
            this.aggregatePostulaciones = [];
            for (let i = 0; i < response.length; i++) {
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
    this.color2 = "#191140";
    this.color3 = "#191140";
    this.color4 = "#191140";
    this.color5 = "#191140";
    this.elegir = 'home';
    this.color1 = '#00A6F7';
  }

  reset(): void {
    window.location.reload();
  }

  Mis_Postulaciones() {
    this.color1 = "#191140";
    this.color3 = "#191140";
    this.color4 = "#191140";
    this.color5 = "#191140";
    this.elegir = 'Mis_Postulaciones';
    this.color2 = '#00A6F7';
    this.cargarPostulaciones();
  }

  verDetalleOferta(idOferta) {
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  
  enviarPostulacion(idOferta): void {
    const formEditData = {
      id_oferta: idOferta,
      dia: this.dia,
      mes: this.mes,
      anio: this.anio
    };
    const formOferta = {
      id_estudiante: this.estudianteActual._id,
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
                  this.OfertasService.agregarPostulacionOferta(idOferta, formOferta).
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
                     error =>{
                       console.log('Error al actualizar oferta', error);
                       Swal.fire({
                         title: "Usted ya se postuló a esta oferta",
                         icon: 'error',
                         showCloseButton: true
                       });
                      }
                   )
                },
                error => {
                  console.log('Error al actualizar informacion estudiante', error);
                }
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
    

  }
  openSm(content, idOferta) {
    this.modalService.open(content, { size: 'lg', centered: true } );
    this.verDetalleOferta(idOferta);
  }

  eliminarPostulacion(idOferta): void{
    this.OfertasService.eliminarPostulacionOferta(idOferta, this.estudianteActual._id)
    .subscribe 
    (res => {
      // console.log(res);
      if (res.ok == 1) {
        this.estudiantesService.eliminarPostulacionEstudiantes(this.estudianteActual._id, idOferta)
        .subscribe(
          res=> {
            this.cargarPostulaciones();
            this.modalService.dismissAll();
          }, 
          error=> console.log('Error al eliminar oferta del lado de Estudiannte', error) 
        )
      }
    },
    error => console.log('Error al eliminar oferta del lado de ofertas', error)
  );
    
  }
  

}
