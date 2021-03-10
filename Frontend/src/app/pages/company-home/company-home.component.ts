import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresasService } from 'src/app/services/empresas.service';


@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.css']
})
export class CompanyHomeComponent implements OnInit {
  empresaActual: any;
  constructor(
    private authService: AuthService,
    private empresasService: EmpresasService
  ) { }

  ngOnInit(): void {
    // Estudiantes
    if (this.authService.loggedInCompany() && this.authService.getRol() == 'Empresa') {
      this.empresasService.obtenerIDEmpresa()
        .subscribe(
          res => {
            this.empresasService.obtenerEmpresa(res.id)
              .subscribe(
                data => {
                  console.log(data);
                  this.empresaActual = data;
                },
                error => console.log('Error al obtener informacion empresa', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    }
  }

  getAuthService() {
    return this.authService;
  }

}
