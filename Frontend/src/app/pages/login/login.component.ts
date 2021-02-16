import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor() { }

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
    
    Swal.fire({
      title: 'Login exitoso',
      text: '',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(success => {
      window.location.href = '/student/home';
    }
    ).catch(err => console.log(err));
  }

  cambiarInput(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
  ngOnDestroy(): void {
    document.body.classList.remove('student-login');
  }
}
