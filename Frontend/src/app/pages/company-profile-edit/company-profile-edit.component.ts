import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { customValidations } from 'src/app/utils/custom-validations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-company-profile-edit',
  templateUrl: './company-profile-edit.component.html',
  styleUrls: ['./company-profile-edit.component.css']
})
export class CompanyProfileEditComponent implements OnInit {
  backendHost: string = 'http://localhost:8888/';
  // backendHost: string = 'https://ingsoftware-backend.herokuapp.com/';

  empresa: any;
  idEmpresa: any;
  departamentos: any = ['Atlántida', 'Colón', 'Comayagua', 'Copán', 'Cortés', 'Choluteca', 'El Paraíso',
    'Francisco Morazán', 'Gracias a Dios', 'Intibucá', 'Islas de Bahía', 'La Paz', 'Lempira', 'Ocotepeque',
    'Olancho', 'Santa Bárbara', 'Valle', 'Yoro'];
  formulario_Edit: FormGroup;  
  formularioUploadImage: FormGroup;
  imagenPerfilHabilitada: boolean = false;
  hayImagenPerfil: boolean = false;
  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private empresasService: EmpresasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
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
                  this.createFormEdit();
                },
                error => console.log('Error al obtener informacion empresa', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }

  createFormEdit() {
    this.formulario_Edit = this.fb.group({
      organizacion: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      facebook: [''],
      sitioWeb: [''],
    });
    this.formularioUploadImage = this.fb.group({
      imagenPerfil: [''],
      imagenPerfilSrc: [''],
    });
    this.imagenPerfilSrc.setValue(null);
  }
  get organizacion() {     return this.formulario_Edit.get('organizacion');   }
  get departamento() {     return this.formulario_Edit.get('departamento');   }
  get ciudad() {     return this.formulario_Edit.get('ciudad');   }
  get descripcion() {     return this.formulario_Edit.get('descripcion');   }
  get facebook() {     return this.formulario_Edit.get('facebook');   }
  get sitioWeb() {     return this.formulario_Edit.get('sitioWeb');   }
  get direccion() {     return this.formulario_Edit.get('direccion');   }
  get telefono() {     return this.formulario_Edit.get('telefono');   }
  get imagenPerfil() {
    return this.formularioUploadImage.get('imagenPerfil');
  }
  get imagenPerfilSrc() {
    return this.formularioUploadImage.get('imagenPerfilSrc');
  }

  getAuthService() {
    return this.authService;
  }
  guardarOferta(){

  }
 
  habilitarImagen() {
    this.imagenPerfilHabilitada = !this.imagenPerfilHabilitada;
    console.log(this.imagenPerfilSrc.value);
  }

  selectProfileImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.hayImagenPerfil = true;
      this.formularioUploadImage.patchValue({
        imagenPerfilSrc: file
      });
    }
  }

  cancelProfileImage() {
    this.hayImagenPerfil = false;
    this.formularioUploadImage.reset();
    this.imagenPerfilSrc.setValue(null);
  }

  //---------------------------------------EDICIÓN DE PERFIL------------------------------
  sendForm(): void {
    const formEditData = {
      organizacion: this.organizacion.value,
      descripcionPerfil: this.descripcion.value,
      telefono: this.telefono.value,
      departamento: this.departamento.value,
      ciudad: this.ciudad.value,
      direccion: this.direccion.value,
      facebook: this.facebook.value,
      paginaWeb: this.sitioWeb.value,
    };
    if (this.authService.getRol() == 'Empresa' && this.authService.loggedInCompany()) {
      this.empresasService.obtenerIDEmpresa()
        .subscribe(
          res => {
            if(this.hayImagenPerfil && this.imagenPerfilSrc.value != null){
              this.uploadImage(res.id);
            }
            this.empresasService.actualizarPerfilEmpresa(res.id, formEditData)
              .subscribe(
                success => {
                  console.log(success);
                  // Mensaje success
                  Swal.fire({
                    title: 'Datos actualizados con exito',
                    icon: 'success',
                    showConfirmButton: true
                  }).then(success => {
                    window.location.href = 'company/profile';
                  }
                  ).catch(err => console.log(err));
                },
                error => console.log('Error al actualizar informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }

  }
  uploadImage(idEmpresa) {
    const formDataImage = new FormData();
    formDataImage.append('imagenPerfil', this.imagenPerfilSrc.value);
    this.empresasService.subirImagenPerfil(idEmpresa, formDataImage)
    .subscribe(
      res => {
        console.log(res);
      },
      error => console.log('Error al subir imagen', error)
    )
  }

}
  
