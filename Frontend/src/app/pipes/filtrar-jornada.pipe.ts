import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarJornada'
})
export class FiltrarJornadaPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg == '' ) {
      return value;
    };
    const res_ofertasDepto =[];
    for (let oferta of value){
      if (oferta.jornada_laboral.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        //console.log("funciona");
        res_ofertasDepto.push(oferta);
      };
    };
    return res_ofertasDepto;
  }

}
