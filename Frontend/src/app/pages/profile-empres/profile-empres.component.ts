import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { OfertasService } from 'src/app/services/ofertas.service';


@Component({
  selector: 'app-profile-empres',
  templateUrl: './profile-empres.component.html',
  styleUrls: ['./profile-empres.component.css']
})
export class ProfileEmpresComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';
  date = new Date();

  empresa: any;
  OfertasActivas = [];
  OfertasArchivadas = [];
  ofertasPostulaciones = [];
  estudiantes_postulados = [];
  array_palabras: any = [];
  ofertas_Optimas: Boolean = false;
  postulaciones_Optimas: Boolean = false;
  hayPalabrasClave: Boolean = true;

  ofertaSeleccionada: any;

  elegir = 'perfil';

  color1 = "#00035a";
  color2 = "#00035a";
  color3 = "#00035a";
  color4 = "#00035a";

  //Variable para guardar id de la empresa
  idEmpresa: any;

  // Informacion selects
  departamentos: any = ['Atlántida', 'Colón', 'Comayagua', 'Copán', 'Cortés', 'Choluteca', 'El Paraíso',
    'Francisco Morazán', 'Gracias a Dios', 'Intibucá', 'Islas de Bahía', 'La Paz', 'Lempira', 'Ocotepeque',
    'Olancho', 'Santa Bárbara', 'Valle', 'Yoro'];
  experiencia_laboral: any = ['Sin experiencia', '1 año', '2 años', '3-4 años',
    '5-10 años', 'Más de 10 años', 'No Especificar (N/A)'];
  jornada_laboral: any = ['Tiempo Completo', 'Desde Casa', 'Por Horas', 'Medio Tiempo',
    'Beca/Prácticas', 'No Especificar (N/A)'];
  tipo_contrato: any = ['Contrato por tiempo indefinido', 'Contrato por tiempo determinado', 'Contrato de obra o labor',
    'Contrato de aprendizaje', 'Otro tipo de contrato', 'No Especificar (N/A)'];

  // Form
  formulario_Oferta: FormGroup;
  formEditOferta: FormGroup;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private empresasService: EmpresasService,
    private ofertasService: OfertasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.perfil();
    this.editOfertaModal();
    // Datos Empresa logueada
    if (this.authService.getRol() == 'Empresa') {
      this.empresasService.obtenerIDEmpresa()
        .subscribe(
          res => {
            this.idEmpresa = res.id;
            this.empresasService.obtenerEmpresa(this.idEmpresa)
              .subscribe(
                data => {
                  console.log(data);
                  this.empresa = data;
                },
                error => console.log('Error al obtener informacion empresa', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }

  createFormOferta() {
    this.formulario_Oferta = this.fb.group({
      vacante: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      salario: [''],
      edad: [''],
      idiomas: [''],
      indiceEstudiante: [''],
      experienciaLaboral: ['', [Validators.required]],
      jornadaLaboral: ['', [Validators.required]],
      tipoContrato: ['', [Validators.required]],
      palabrasClave: ['']
    })
  }

  // Metodos GET
  get vacante() {
    return this.formulario_Oferta.get('vacante');
  }
  get departamento() {
    return this.formulario_Oferta.get('departamento');
  }
  get ciudad() {
    return this.formulario_Oferta.get('ciudad');
  }
  get descripcion() {
    return this.formulario_Oferta.get('descripcion');
  }
  get salario() {
    return this.formulario_Oferta.get('salario');
  }
  get edad() {
    return this.formulario_Oferta.get('edad');
  }
  get idiomas() {
    return this.formulario_Oferta.get('idiomas');
  }
  get indiceEstudiante() {
    return this.formulario_Oferta.get('indiceEstudiante');
  }
  get experienciaLaboral() {
    return this.formulario_Oferta.get('experienciaLaboral');
  }
  get jornadaLaboral() {
    return this.formulario_Oferta.get('jornadaLaboral');
  }
  get tipoContrato() {
    return this.formulario_Oferta.get('tipoContrato');
  }
  get palabrasClave() {
    return this.formulario_Oferta.get('palabrasClave');
  }

  addItem(item): void {
    if (item != "") {
      console.log('Selected: ', item);
      if (!this.array_palabras.some(current => current === item)) {
        this.array_palabras.push(item);
      }
      this.hayPalabras_Clave();
    }
  }

  removeItem(item): void {
    console.log('Remove: ', item);
    this.array_palabras = this.array_palabras.filter(current => current !== item);
    this.hayPalabras_Clave();
  }

  hayPalabras_Clave() {
    if (this.array_palabras.length > 0) {
      this.hayPalabrasClave = true;
      return true;
    } else {
      this.hayPalabrasClave = false;
      return false;
    }
  }

  // Funcion ofertas     
  guardarOferta() {
    let salary = this.salario.value;
    let age = this.edad.value;
    let languages = this.idiomas.value;
    let student_index = this.indiceEstudiante.value;
    let work_experience = this.experienciaLaboral.value;
    let working_day = this.jornadaLaboral.value;
    let contract_type = this.tipoContrato.value;
    if (this.salario.value == '' || this.salario.value == null) {
      salary = null;
    }
    if (this.edad.value == '' || this.edad.value == null) {
      age = null;
    }
    if (this.idiomas.value == '' || this.idiomas.value == null) {
      languages = null;
    }
    if (this.indiceEstudiante.value == '' || this.indiceEstudiante.value == null || this.indiceEstudiante.value > 100) {
      student_index = null;
    }
    if (this.experienciaLaboral.value == 'No Especificar (N/A)') {
      work_experience = null;
    }
    if (this.jornadaLaboral.value == 'No Especificar (N/A)') {
      working_day = null;
    }
    if (this.tipoContrato.value == 'No Especificar (N/A)') {
      contract_type = null;
    }

    let dia = this.date.getDate();
    let mes = this.date.getMonth() + 1;
    let anio = this.date.getFullYear();

    if (this.hayPalabras_Clave() && this.authService.loggedInCompany()) {
      const formOfertaData = {
        idEmpresa: this.idEmpresa,
        titulo_Oferta: this.vacante.value,
        departamento: this.departamento.value,
        ciudad: this.ciudad.value,
        dia: dia,
        mes: mes,
        anio: anio,
        descripcion: this.descripcion.value,
        palabras_clave: this.array_palabras,
        idiomas: languages,
        edad: age,
        indice_estudiante: student_index,
        experiencia_laboral: work_experience,
        jornada_laboral: working_day,
        tipo_contrato: contract_type,
        salario: salary,
      }
      this.ofertasService.guardarOferta(formOfertaData)
        .subscribe(
          res => {
            console.log("Respuesta al guardar Oferta", res);
            if (res.mensaje == 'Oferta Publicada') {
              this.empresasService.guardarIDOfertaEmpresa(this.idEmpresa, res.data._id)
                .subscribe(
                  response => {
                    console.log("Respuesta al guardar IDOferta en Empresa", response);
                    if (response.ok == 1) {
                      // Mensaje success
                      Swal.fire({
                        title: 'Oferta publicada con exito!',
                        icon: 'success',
                        showConfirmButton: true
                      }).then(success => {
                        window.location.href = 'company/profile';
                      }
                      ).catch(err => console.log(err));
                    }
                  },
                  error => console.log(error)
                )
            }
          },
          err => console.log(err)
        )
    }
    /*
    Swal.fire(
      'oferta creada con exito!',
      'da click en el boton!',
      'success'
    )*/

    /*ESTA ALERTA ES POR SI DA ERROR AL CREAR LA TARJETA
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Parece que algo salio mal'
    })  
    */
  }

  // Funcion cargar ofertas empresa
  cargarOfertasRealizadas() {
    this.ofertasService.obtenerOfertasEmpresa(this.idEmpresa)
      .subscribe(
        res => {
          // Reset Ofertas
          this.OfertasActivas = [];
          this.OfertasArchivadas = [];
          this.ofertasPostulaciones = [];
          if (res.length > 2) {
            this.ofertas_Optimas = true;
          } else {
            this.ofertas_Optimas = false;
          }
          // Recorrer para ofertas activas y archivadas
          for (let i = 0; i < res.length; i++) {
            if (res[i].fecha_publicacion[0].dia < 10) {
              res[i].fecha_publicacion[0].dia = `0${res[i].fecha_publicacion[0].dia}`;
            }
            if (res[i].fecha_publicacion[0].mes < 10) {
              res[i].fecha_publicacion[0].mes = `0${res[i].fecha_publicacion[0].mes}`;
            }
            if (res[i].estado_oferta == true) {
              this.OfertasActivas.push(res[i]);
              if (res[i].postulaciones.length > 0) {
                this.ofertasPostulaciones.push(res[i]);
              }
            }
            if (res[i].estado_oferta == false) {
              this.OfertasArchivadas.push(res[i]);
            }
          }
          // console.log(this.OfertasActivas);
        },
        error => console.log('error al obterner ofertas', error)
      )
  }

  // Componente Perfil
  perfil() {
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = "#00035a";
    this.color1 = '#078bbe';
    this.elegir = 'perfil';
  }

  // Componente Ofertas Realizadas
  verOfertas() {
    this.color1 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = "#00035a";
    this.color2 = '#078bbe';
    this.elegir = 'listarOfertas';
    this.cargarOfertasRealizadas();
  }

  // Componente Oferta
  oferta() {
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color4 = "#00035a";
    this.color3 = '#078bbe';
    this.elegir = 'oferta';
    this.array_palabras = [];
    this.createFormOferta();
  }

  // Componente postulados
  postulados() {
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = '#078bbe';
    this.elegir = 'postulados';
    this.cargarOfertasRealizadas();
  }

  // Componente postuladosDetalle
  postuladosDetalle(idOferta) {
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = '#078bbe';
    this.elegir = 'postuladosDetalle';
    this.ofertasService.obtenerPostulacionesOferta(idOferta)
      .subscribe(
        res => {
          if (res.length > 4) {
            this.postulaciones_Optimas = true;
          } else {
            this.postulaciones_Optimas = false;
          }
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res[i].postulaciones.length; j++) {
              if (res[i].estudiante._id == res[i].postulaciones[j].id_estudiante) {
                res[i].postulaciones = res[i].postulaciones[j];
              }
            }
            if (res[i].postulaciones.fecha_postulacion.dia < 10) {
              res[i].postulaciones.fecha_postulacion.dia = `0${res[i].postulaciones.fecha_postulacion.dia}`;
            }
            if (res[i].postulaciones.fecha_postulacion.mes < 10) {
              res[i].postulaciones.fecha_postulacion.mes = `0${res[i].postulaciones.fecha_postulacion.mes}`;
            }
          }
          this.estudiantes_postulados = res;
        },
        error => console.log('error al obterner ofertas', error)
      )
  }

  editOfertaModal() {
    this.formEditOferta = this.fb.group({
      _id: [''],
      titulo_Oferta: ['', [Validators.required]],
      idiomas: [''],
      salario: [''],
      edad: [''],
      indice_estudiante: [''],
      ciudad: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      experiencia_laboral: ['', [Validators.required]],
      jornada_laboral: ['', [Validators.required]],
      tipo_contrato: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    })
  }

  // Metodos GET de formEditOferta
  get titulo_Oferta() {
    return this.formEditOferta.get('titulo_Oferta');
  }
  get ciudadEdit() {
    return this.formEditOferta.get('ciudad');
  }
  get departamentoEdit() {
    return this.formEditOferta.get('departamento');
  }
  get experiencia_laboralEdit() {
    return this.formEditOferta.get('experiencia_laboral');
  }
  get jornada_laboralEdit() {
    return this.formEditOferta.get('jornada_laboral');
  }
  get tipo_contratoEdit() {
    return this.formEditOferta.get('tipo_contrato');
  }
  get descripcionEdit() {
    return this.formEditOferta.get('descripcion');
  }

  detalleOferta(oferta){
    this.formEditOferta.reset();
    this.formEditOferta.patchValue(oferta);
    this.ciudadEdit.setValue(oferta.ubicacion[0].ciudad);
    this.departamentoEdit.setValue(oferta.ubicacion[0].departamento);
  }

  listarOferta(oferta) {
    this.formEditOferta.reset();
    this.formEditOferta.patchValue(oferta);
    this.ciudadEdit.setValue(oferta.ubicacion[0].ciudad);
    this.departamentoEdit.setValue(oferta.ubicacion[0].departamento);
    // console.log(this.formEditOferta.value);
  }

  actualizarOferta() {
    /*const data = this.formEditOferta.getRawValue()
    data['ubicacion'] = [{ ciudad: data.ciudad, departamento: data.departamento }]*/
    let languages = this.formEditOferta.get('idiomas').value;
    let salary = this.formEditOferta.get('salario').value;
    let age = this.formEditOferta.get('edad').value;
    let student_index = this.formEditOferta.get('indice_estudiante').value;
    let work_experience = this.experiencia_laboralEdit.value;
    let working_day = this.jornada_laboralEdit.value;
    let contract_type = this.tipo_contratoEdit.value;
    if (this.formEditOferta.get('idiomas').value == '' || this.formEditOferta.get('idiomas').value == null) {
      languages = null;
    }
    if (this.formEditOferta.get('salario').value == '' || this.formEditOferta.get('salario').value == null) {
      salary = null;
    }
    if (this.formEditOferta.get('edad').value == '' || this.formEditOferta.get('edad').value == null) {
      age = null;
    }
    if (this.formEditOferta.get('indice_estudiante').value == '' || this.formEditOferta.get('indice_estudiante').value == null || this.formEditOferta.get('indice_estudiante').value > 100) {
      student_index = null;
    }
    if (this.experiencia_laboralEdit.value == 'No Especificar (N/A)') {
      work_experience = null;
    }
    if (this.jornada_laboralEdit.value == 'No Especificar (N/A)') {
      working_day = null;
    }
    if (this.tipo_contratoEdit.value == 'No Especificar (N/A)') {
      contract_type = null;
    }
    const formData = {
      titulo_Oferta: this.titulo_Oferta.value,
      idiomas: languages,
      salario: salary,
      edad: age,
      indice_estudiante: student_index,
      ciudad: this.ciudadEdit.value,
      departamento: this.departamentoEdit.value,
      experiencia_laboral: work_experience,
      jornada_laboral: working_day,
      tipo_contrato: contract_type,
      descripcion: this.descripcionEdit.value
    }
    this.ofertasService.actualizarOferta(this.formEditOferta.get('_id').value, formData)
      .subscribe(
        res => {
          console.log(res);
          if (res.ok == 1) {
            this.verOfertas();
          }
        },
        error => console.log('Error al actualizar oferta', error)
      )
  }

  modalOfertaConfirmar(modal, oferta) {
    this.ofertaSeleccionada = oferta;
    this.modalService.open(
      modal,
      {
        centered: false
      }
    );
  }

  archivar() {
    if (this.ofertaSeleccionada != null) {
      this.ofertasService.archivarOferta(this.ofertaSeleccionada._id)
        .subscribe(
          res => {
            // console.log(res);
            if (res.ok == 1) {
              this.verOfertas();
              this.modalService.dismissAll();
            }
          },
          error => console.log('Error al cambiar estado de oferta', error)
        )
    }
  }

  restaurar(id) {
    this.ofertasService.restaurarOferta(id)
      .subscribe(
        res => {
          // console.log(res);
          if (res.ok == 1) {
            this.verOfertas();
          }
        },
        error => console.log('Error al cambiar estado de oferta', error)
      )
  }

  borrarOferta() {
    if (this.ofertaSeleccionada != null) {
      this.ofertasService.borrarOferta(this.ofertaSeleccionada._id)
      .subscribe(
        res => {
          // console.log(res);
          if (res.ok == 1) {
            this.verOfertas();
            this.modalService.dismissAll();
          }
        },
        error => console.log('Error al eliminar oferta', error)
      );
    }
  }

  getAuthService() {
    return this.authService;
  }

  verPerfil(idEstudiante){
    this.empresasService.seleccionarEstudiante(idEstudiante);
    this.router.navigateByUrl(`company/student-selected`);
  }

}