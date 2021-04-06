import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  array_palabras: any = [];
  ofertas_Optimas: Boolean = false;
  postulaciones_Optimas: Boolean = false;
  hayPalabrasClave: Boolean = true;

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private empresasService: EmpresasService,
    private ofertasService: OfertasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.perfil();
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
            }
            if (res[i].estado_oferta == false) {
              this.OfertasArchivadas.push(res[i]);
            }
          }
          console.log(this.OfertasActivas);
        },
        error => console.log('error al obterner ofertas', error)
      )
  }

  // Componente Perfil
  perfil() {
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = "#00035a";
    this.color1 = '#ffc400';
    this.elegir = 'perfil';
  }

  // Componente Ofertas Realizadas
  verOfertas() {
    this.color1 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = "#00035a";
    this.color2 = '#ffc400';
    this.elegir = 'listarOfertas';
    this.cargarOfertasRealizadas();
  }

  // Componente Oferta
  oferta() {
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color4 = "#00035a";
    this.color3 = '#ffc400';
    this.elegir = 'oferta';
    this.createFormOferta();
  }

  // Componente postulados
  postulados() {
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = '#ffc400';
    this.elegir = 'postulados';
    this.cargarOfertasRealizadas();
  }

  // Componente postuladosDetalle
  postuladosDetalle(){
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = '#ffc400';
    this.elegir = 'postuladosDetalle';

  }

  getAuthService() {
    return this.authService;
  }

}