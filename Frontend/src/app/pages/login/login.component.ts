import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailValido: boolean = true;
  passwordValido: boolean = true;

  formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@unah+\\.hn")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    document.body.classList.add('student-login');
    this.formularioLogin.reset();
  }

  // Metodos GET
  get email() {
    return this.formularioLogin.get('email');
  }
  get password() {
    return this.formularioLogin.get('password');
  }

  login() {
    // Funcionalidad boton login
    this.emailValido = true;
    this.passwordValido = true;
    const formData = this.formularioLogin.value;
    // console.log(formData);
    this.authService.loginEstudiante(formData)
      .subscribe(
        response => {
          console.log('Respuesta del servidor', response);
          if (response.mensaje == 'OK') {
            // Guardar tokens en localStorage
            this.authService.storeTokens(response.data);
            // Mensaje success
            Swal.fire({
              title: '',
              text: '',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            }).then(success => {
              // window.location.href = '/student/home';
              this.router.navigate(['/student/home']);
            }
            ).catch(err => console.log(err));
          }
        },
        error => {
          if (error.error.mensaje == 'No-Autorizado: Email no encontrado') {
            this.emailValido = false;
          }
          if (error.error.mensaje == 'No-Autorizado: Password incorrecta') {
            this.passwordValido = false;
          }
        }
      )
  }

  cambiarInput(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  ngOnDestroy(): void {
    document.body.classList.remove('student-login');
  }
}
