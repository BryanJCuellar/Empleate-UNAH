import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarDepto'
})
export class FiltrarDeptoPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg == null ) {
      return value;
    };
    const res_ofertasDepto =[];
    for (let oferta of value){
      if (oferta.ubicacion[0].departamento.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        //console.log("funciona");
        res_ofertasDepto.push(oferta);
      };
    };
    return res_ofertasDepto;
  }

}
