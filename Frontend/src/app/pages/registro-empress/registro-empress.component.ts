import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
// Custom Validations
import { customValidations } from 'src/app/utils/custom-validations';
import { ConfirmedValidator } from 'src/app/utils/confirmed.validator';
// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-empress',
  templateUrl: './registro-empress.component.html',
  styleUrls: ['./registro-empress.component.css']
})
export class RegistroEmpressComponent implements OnInit {
  formRegistro: boolean = true;
  confirmRegistro: boolean = false;
  emailDuplicado: boolean = false;
  errorCodigo: boolean = false;
  codigoExpirado: boolean = false;
  departamentos: any = ['Atlántida', 'Colón', 'Comayagua', 'Copán', 'Cortés', 'Choluteca', 'El Paraíso',
    'Francisco Morazán', 'Gracias a Dios', 'Intibucá', 'Islas de Bahía', 'La Paz', 'Lempira', 'Ocotepeque',
    'Olancho', 'Santa Bárbara', 'Valle', 'Yoro'];
  codigo_hash: String;
  formularioEmpresa: FormGroup;
  formularioConfirm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.formularioEmpresa.reset();
  }

  createForm() {
    this.formularioEmpresa = this.fb.group({
      name: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{4}[-][0-9]{4}")]],
      departament: ['', [Validators.required, customValidations.valueRestricted('-')]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      samePassword: ['', [Validators.required]]
    }, {
      // Verificar que passwords coincidan
      validator: ConfirmedValidator('password', 'samePassword')
    });
  }
  // Email existe ?
  validarEmail() {
    if (this.email.valid) {
      this.email.valueChanges
        .pipe(
          // in milliseconds (ms)
          debounceTime(500)
        )
        .subscribe(value => {
          const dataEmail = {
            email: value
          }
          // console.log(value);
          this.authService.validateEmailRegister(dataEmail)
            .subscribe(
              response => {
                // console.log(response);
                this.emailDuplicado = false;
              },
              error => {
                if (error.error.mensaje == 'Email ya registrado') {
                  this.emailDuplicado = true;
                }
              }
            )
        });
    }
  }

  confirmacionEmail() {
    this.formularioConfirm = this.fb.group({
      codigoConfirm: ['', [Validators.required]]
    });
    this.formRegistro = false;
    this.confirmRegistro = true;
    this.enviarConfirmacionEmail();
  }

  enviarConfirmacionEmail() {
    this.codigoExpirado = false;
    const data = {
      email: this.email.value
    };
    this.authService.sendMailRegister(data)
      .subscribe(
        res => {
          console.log(res.data);
          this.codigo_hash = res.code_hash;
          setTimeout(() => {
            console.log(`El codigo ${this.codigo_hash} ha expirado`);
            this.codigo_hash = '';
          }, 90000)
        },
        error => console.log(error)
      )
  }

  // Metodos GET
  // formularioEmpresa
  get name() {
    return this.formularioEmpresa.get('name');
  }
  get direction() {
    return this.formularioEmpresa.get('direction');
  }

  get phone() {
    return this.formularioEmpresa.get('phone');
  }
  get departament() {
    return this.formularioEmpresa.get('departament');
  }
  get city() {
    return this.formularioEmpresa.get('city');
  }
  get email() {
    return this.formularioEmpresa.get('email');
  }
  get password() {
    return this.formularioEmpresa.get('password');
  }
  get samePassword() {
    return this.formularioEmpresa.get('samePassword');
  }
  // formularioConfirm
  get codigoConfirm() {
    return this.formularioConfirm.get('codigoConfirm');
  }

  registrar() {
    this.errorCodigo = false;
    const formData = {
      organizacion: this.name.value,
      direccion: this.direction.value,
      telefono: this.phone.value,
      departamento: this.departament.value,
      ciudad: this.city.value,
      email: this.email.value,
      password: this.password.value,
      codigoConfirmacion: this.codigoConfirm.value,
      codigoHash: this.codigo_hash
    };
    this.authService.registrarEmpresa(formData)
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
              // window.location.href = '/company/home';
              this.router.navigate(['/company/home']);
            }
            ).catch(err => console.log(err));
          }
        },
        error => {
          console.log(error);
          if (error.error.mensaje == 'Codigo no valido') {
            this.errorCodigo = true;
            if (this.codigo_hash == '') {
              this.codigoExpirado = true;
            }
          }
        }
      )
  }

  mostrarPasswords(input: any, input2: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }


}

