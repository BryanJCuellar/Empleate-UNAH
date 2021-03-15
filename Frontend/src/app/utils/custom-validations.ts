import { AbstractControl } from '@angular/forms';

export class customValidations {
    // Valor restringido para option value
    static valueRestricted(valor: String) {
        return (control: AbstractControl) => {
            const value = control.value;
            if (value == valor) {
                return { valueRestricted: true };
            }
            return null;
        }
    }  
}