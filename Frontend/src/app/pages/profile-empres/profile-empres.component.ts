import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {MatTabsModule} from '@angular/material/tabs';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { OfertasService } from 'src/app/services/ofertas.service';


@Component({
  selector: 'app-profile-empres',
  templateUrl: './profile-empres.component.html',
  styleUrls: ['./profile-empres.component.css']
})
export class ProfileEmpresComponent implements OnInit {
  addoffer:any={
  vacante:'puesto',
  empresa:'compania',
  ubicacion:'localidad',
  imagen:'imagen',
  info:'contenido',
  fecha:'fecha'
}

 arreglo:any=[];
 empresa: any;
 OfertasActivas =  [] ;
 OfertasArchivadas =  [] ;

  elegir='perfil';
 
  color1 = "#00035a";
  color2 = "#00035a";
  color3 = "#00035a";
  color4 = "#00035a";
  
  //Variable para guardar id de la empresa
  idEmpresa : any;

  constructor(private empresasService: EmpresasService, private ofertasService: OfertasService, private authService: AuthService) {  }
  ngOnInit(): void { 
    if (this.authService.getRol() == 'Empresa') {
      this.empresasService.obtenerIDEmpresa()
        .subscribe(
          res => {
            this.idEmpresa = res.id;
            this.empresasService.obtenerEmpresa(this.idEmpresa)
              .subscribe(
                data => {
                  // console.log(data);
                
                  this.empresa = data;
                  //this.ListarOfertas( this.idEmpresa);
                  console.log(this.empresa);
                },
                error => console.log('Error al obtener informacion empresa', error)
              )
          },
          error => console.log('Error al obtener ID', error)
        )
    
       }
  
   

  }
 
//funcion ofertas     
  guardar(){
    this.arreglo.push({
      vacante: this.addoffer.vacante,
      empresa: this.addoffer.empresa,
      ubicacion: this.addoffer.ubicacion,
      imagen: this.addoffer.imagen,
      info: this.addoffer.info,
      fecha: this.addoffer.fecha
      
    });
    Swal.fire(
      'oferta creada con exito!',
      'da click en el boton!',
      'success'
    )
    console.log(this.addoffer);

    /*ESTA ALERTA ES POR SI DA ERROR AL CREAR LA TARJETA
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Parece que algo salio mal'
    })  
    */
    
  }

verOfertas(){     
    this.color1 = "#00035a";     
    this.color3 = "#00035a";     
    this.color4 = "#00035a";     
    this.elegir='listarOfertas';     
    this.color2 = '#ffc400';   

    this.ofertasService.obtenerOfertasEmpresa(this.idEmpresa)
    .subscribe(
    res => {

      for (let i=0; i<=res.length-1; i++){

      
      if(res[i].estado_oferta == true){
        this.OfertasActivas.push(res[i]);
      }
      if(res[i].estado_oferta == false){
        this.OfertasArchivadas.push(res[i]);
      }
    
    }
      console.log("Ofertas");
      
    },
    error => console.log('error al obterner ofertas', error)
    )
}
  perfil(){
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.color4 = "#00035a";
    this.elegir='perfil';
    this.color1 = '#ffc400';
  }
  oferta(){
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color4 = "#00035a";
    this.elegir='oferta';
    this.color3 = '#ffc400';
  }
  favoritos(){
    this.color1 = "#00035a";
    this.color2 = "#00035a";
    this.color3 = "#00035a";
    this.elegir='favoritos';
    this.color4 = '#ffc400';
  }
  
}  