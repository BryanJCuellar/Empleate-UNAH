import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {MatTabsModule} from '@angular/material/tabs';
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

  elegir='perfil';
  constructor() {  }
  ngOnInit(): void { 
  }
 

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


  perfil(){
    this.elegir='perfil'
  }
  empleos(){
    this.elegir='empleos'
  }
  oferta(){
    this.elegir='oferta'
  }
  favoritos(){
    this.elegir='favoritos'
  }
  
}
