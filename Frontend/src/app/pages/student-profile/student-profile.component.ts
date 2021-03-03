import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit {

  form: FormGroup;
  languages = ['Espanol', 'Ingles', 'Frances'];
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
    if (this.authService.getRol() == 'Estudiante' && this.authService.loggedInStudent() ) {
      this.estudiantesService.obtenerIDEstudiante()
        .subscribe(
          res => {
            this.estudiantesService.obtenerEstudiante(res.id)
              .subscribe(
                data => {
                   console.log(data);
                  this.estudianteActual = data;
                },
                error => console.log('Error al obtener informacion estudiante', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
    this.crearFormulario();
  }

 

  crearFormulario(): void {
    this.form = this.fb.group({
      profileDescription  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      phone               : ['', Validators.required],
      interests           : ['', Validators.required],
      curriculum          : ['', Validators.required],
      languages           : [[], Validators.required],
      selected            : [],
      address: this.fb.group({
        nationality : ['', Validators.required ],
        country     : ['', Validators.required ],
        department  : ['', Validators.required ],
        city        : ['', Validators.required ],
        postalCode  : ['', Validators.required ],
      }),
    });
  }

  addItem(item): void {
    console.log('Selected: ', item);
    if (!this.selectedLanguages.some(current => current === item)) {
      this.selectedLanguages.push(item);
    }
  }

  /* removeItem(language: string): void {
    console.log('Remove: ', language);
    this.selectedLanguages.filter(current => current !== language);
  } */

  getAvailableLanguages(): string[] {
    return this.languages.filter(item => !this.selectedLanguages.some(item2 => item2 === item));
  }

  submitForm(): void {
    console.log( this.form.value );
  }
  getAuthService() {
    return this.authService;
  }

}
