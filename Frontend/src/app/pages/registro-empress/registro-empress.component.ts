import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-empress',
  templateUrl: './registro-empress.component.html',
  styleUrls: ['./registro-empress.component.css']
})
export class RegistroEmpressComponent implements OnInit {
  emailDuplicado: boolean = false;
  passwordEqual: boolean = true;
  formularioEstudiante: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formularioEstudiante = this.fb.group({
      name: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@unah+\\.hn")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      samePassword: ['', [Validators.required]]
    })
  }

  // Metodos GET
  get name() {
    return this.formularioEstudiante.get('name');
  }
  get direction() {
    return this.formularioEstudiante.get('direction');
  }
  get email() {
    return this.formularioEstudiante.get('email');
  }
  get password() {
    return this.formularioEstudiante.get('password');
  }
  get samePassword() {
    return this.formularioEstudiante.get('samePassword');
  }

  registrar() {
    // Verificar que passwords coincidan
    this.passwordEqual = true;
    this.emailDuplicado = false
    if (this.password.value !== this.samePassword.value) {
      this.passwordEqual = false;
      return;
    }
    const formData = {
      nombre: this.name.value,
      direccion: this.direction.value,
      email: this.email.value,
      password: this.password.value
    };
    this.authService.registrarEstudiante(formData)
      .subscribe(
        response => {
          console.log('Respuesta del servidor', response);
          if (response.mensaje == "Registrado") {
            // Guardar token en localStorage
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('rol', response.data.rol);
            // Mensaje success
            Swal.fire({
              title: 'Registro exitoso',
              text: 'Redireccionando en 2 segundos',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(success => {
              window.location.href = '/student/home';
            }
            ).catch(err => console.log(err));
          }
        },
        error => {
          if (error.error.mensaje == 'Email ya registrado') {
            this.emailDuplicado = true;
          }
        }
      )
  }

  mostrarPasswords(input: any, input2: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }


}

