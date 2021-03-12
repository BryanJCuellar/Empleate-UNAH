import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
// Custom Validations
import { customValidations } from 'src/app/utils/custom-validations';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-profile-edit',
  templateUrl: './student-profile-edit.component.html',
  styleUrls: ['./student-profile-edit.component.css']
})
export class StudentProfileEditComponent implements OnInit {
  formularioEdit: FormGroup;
  formularioUploadImage: FormGroup;
  formularioUploadCV: FormGroup;
  imagenPerfilHabilitada: boolean = false;
  hayImagenPerfil: boolean = false;
  hayCurriculum: boolean = false;
  departamentos: any = ['Atlántida', 'Colón', 'Comayagua', 'Copán', 'Cortés', 'Choluteca', 'El Paraíso',
    'Francisco Morazán', 'Gracias a Dios', 'Intibucá', 'Islas de Bahía', 'La Paz', 'Lempira', 'Ocotepeque',
    'Olancho', 'Santa Bárbara', 'Valle', 'Yoro'];
  idiomas = ['Español', 'Inglés', 'Francés', 'Portugués', 'Alemán', 'Chino Mandarín'];
  selectedLanguages = [];
  estudianteActual: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private estudiantesService: EstudiantesService

  ) {
  }
  ngOnInit(): void {
    // Estudiantes
    if (this.authService.getRol() == 'Estudiante' && this.authService.loggedInStudent()) {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.estudiantesService.obtenerEstudiante(res.id)
              .subscribe(
                data => {
                  console.log(data);
                  this.estudianteActual = data;
                  this.crearFormulario();
                },
                error => console.log('Error al obtener informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }

  crearFormulario(): void {
    let departamento = '';
    let ciudad = '';
    let direccion = '';
    if (this.estudianteActual.datosDireccion != null) {
      departamento = this.estudianteActual.datosDireccion[0].departamento;
      ciudad = this.estudianteActual.datosDireccion[0].ciudad;
      direccion = this.estudianteActual.datosDireccion[0].direccion;
    }
    if (this.estudianteActual.Lenguajes != null) {
      this.selectedLanguages = this.estudianteActual.Lenguajes;
    }
    // Formulario campos editar
    this.formularioEdit = this.fb.group({
      profileDescription: [this.estudianteActual.descripcionPerfil, Validators.required],
      phone: [this.estudianteActual.telefono, [Validators.required, Validators.pattern("^[0-9]{4}[-][0-9]{4}")]],
      interests: [this.estudianteActual.intereses, Validators.required],
      languages: [this.estudianteActual.Lenguajes, Validators.required],
      department: [departamento, [Validators.required, customValidations.valueRestricted('-')]],
      city: [ciudad, Validators.required],
      descriptionAddress: [direccion, Validators.required],
    });
    // Formulario imagen perfil
    this.formularioUploadImage = this.fb.group({
      imagenPerfil: [''],
      imagenPerfilSrc: [''],
    });
    // Formulario CV
    this.formularioUploadCV = new FormGroup({
      curriculumAdjunto: new FormControl(''),
      curriculumAdjuntoSrc: new FormControl(''),
    });
    // Resetear campos de formularios de archivos
    this.imagenPerfilSrc.setValue(null);
    this.curriculumAdjuntoSrc.setValue(null);
  }

  // Metodos GET
  // formularioEdit
  get profileDescription() {
    return this.formularioEdit.get('profileDescription');
  }
  get phone() {
    return this.formularioEdit.get('phone');
  }
  get interests() {
    return this.formularioEdit.get('interests');
  }
  get languages() {
    return this.formularioEdit.get('languages');
  }
  get department() {
    return this.formularioEdit.get('department');
  }
  get city() {
    return this.formularioEdit.get('city');
  }
  get descriptionAddress() {
    return this.formularioEdit.get('descriptionAddress');
  }
  // formularioUploadImage
  get imagenPerfil() {
    return this.formularioUploadImage.get('imagenPerfil');
  }
  get imagenPerfilSrc() {
    return this.formularioUploadImage.get('imagenPerfilSrc');
  }
  // formularioUploadCV
  get curriculumAdjunto() {
    return this.formularioUploadCV.get('curriculumAdjunto');
  }
  get curriculumAdjuntoSrc() {
    return this.formularioUploadCV.get('curriculumAdjuntoSrc');
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

  selectCurriculumFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.hayCurriculum = true;
      this.formularioUploadCV.patchValue({
        curriculumAdjuntoSrc: file
      });
    }
  }

  cancelCurriculumFile() {
    this.hayCurriculum = false;
    this.formularioUploadCV.reset();
    this.curriculumAdjuntoSrc.setValue(null);
  }

  addItem(item): void {
    if (item != "") {
      console.log('Selected: ', item);
      if (!this.selectedLanguages.some(current => current === item)) {
        this.selectedLanguages.push(item);
      }
      this.languages.setValue(this.selectedLanguages);
      console.log(this.languages.value);
    }
  }

  removeItem(language): void {
    console.log('Remove: ', language);
    this.selectedLanguages = this.selectedLanguages.filter(current => current !== language);
    this.languages.setValue(this.selectedLanguages);
  }

  /*getAvailableLanguages(): string[] {
    return this.idiomas.filter(item => !this.selectedLanguages.some(item2 => item2 === item));
  }*/

  sendForm(): void {
    const formEditData = {
      descripcionPerfil: this.profileDescription.value,
      telefono: this.phone.value,
      intereses: this.interests.value,
      Lenguajes: this.languages.value,
      departamento: this.department.value,
      ciudad: this.city.value,
      direccion: this.descriptionAddress.value
    };
    if (this.authService.getRol() == 'Estudiante' && this.authService.loggedInStudent()) {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            if(this.hayImagenPerfil && this.imagenPerfilSrc.value != null){
              this.uploadImage(res.id);
            }
            if(this.hayCurriculum && this.curriculumAdjuntoSrc.value != null){
              this.uploadCV(res.id);
            }
            this.estudiantesService.actualizarPerfilEstudiante(res.id, formEditData)
              .subscribe(
                success => {
                  console.log(success);
                  // Mensaje success
                  Swal.fire({
                    title: 'Datos actualizados con exito',
                    icon: 'success',
                    showConfirmButton: true
                  }).then(success => {
                    window.location.href = 'student/profile';
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
  uploadImage(idEstudiante) {
    const formDataImage = new FormData();
    formDataImage.append('imagenPerfil', this.imagenPerfilSrc.value);
    this.estudiantesService.subirImagenPerfil(idEstudiante, formDataImage)
    .subscribe(
      res => {
        console.log(res);
      },
      error => console.log('Error al subir imagen', error)
    )
  }
  uploadCV(idEstudiante) {
    const formDataCV = new FormData();
    formDataCV.append('CurriculumAdjunto', this.curriculumAdjuntoSrc.value);
    this.estudiantesService.subirCV(idEstudiante, formDataCV)
    .subscribe(
      res => {
        console.log(res);
      },
      error => console.log('Error al subir archivo', error)
    )
  }
  getAuthService() {
    return this.authService;
  }


}
