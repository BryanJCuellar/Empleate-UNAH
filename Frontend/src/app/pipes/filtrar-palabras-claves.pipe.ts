import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarPalabrasClaves'
})
export class FiltrarPalabrasClavesPipe implements PipeTransform {

  transform(value: any, arg: string): any {
    if (arg == '' || arg.length < 3) return value;
    const res_ofertasPalbrasClaves = [];
    for (let palabrasClaves of value){
      if (palabrasClaves.palabras_clave[0].toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        //console.log("funciona");
        res_ofertasPalbrasClaves.push(palabrasClaves);
      };
    };
    return res_ofertasPalbrasClaves;
  }

}
