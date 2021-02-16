import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formularioEstudiante = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@unah+\\.hn")]),
    password: new FormControl('', [Validators.required]),
    samepassword: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
  }

  registrar() {

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

}
