import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-empress',
  templateUrl: './login-empress.component.html',
  styleUrls: ['./login-empress.component.css']
})
export class LoginEmpressComponent implements OnInit {
  emailValido: boolean = true;
  passwordValido: boolean = true;

  formularioLoginCompany = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    document.body.classList.add('student-login');
    this.formularioLoginCompany.reset();
  }

  // Metodos GET
  get email() {
    return this.formularioLoginCompany.get('email');
  }
  get password() {
    return this.formularioLoginCompany.get('password');
  }

  login() {
    // Funcionalidad boton login
    this.emailValido = true;
    this.passwordValido = true;
    const formData = this.formularioLoginCompany.value;
    // console.log(formData);
    this.authService.loginEmpresa(formData)
      .subscribe(
        response => {
          console.log('Respuesta del servidor', response);
          if (response.mensaje == 'OK') {
            // Guardar token en localStorage
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('rol', response.data.rol);
            // Mensaje success
            Swal.fire({
              title: '',
              text: '',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            }).then(success => {
              // window.location.href = '/company/home';
              this.router.navigate(['/company/profile']);
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

