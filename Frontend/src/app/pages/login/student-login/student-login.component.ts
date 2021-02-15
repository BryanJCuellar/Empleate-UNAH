import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  emailValido: boolean = true;
  passwordValido: boolean = true;

  formularioLoginEstudiante = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@unah+\\.hn")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor() { }

  ngOnInit(): void {
    document.body.classList.add('student-login');
    this.formularioLoginEstudiante.reset();
  }

  // Metodos GET
  get email() {
    return this.formularioLoginEstudiante.get('email');
  }
  get password() {
    return this.formularioLoginEstudiante.get('password');
  }

  loginEstudiante() {
    // Funcionalidad boton login

    Swal.fire({
      title: 'Login exitoso',
      text: '',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(success => {
      window.location.href = '/home/student';
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
