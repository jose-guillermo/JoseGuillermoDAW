import { AbstractControl } from "@angular/forms";


export const emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
export const passwordPattern: string = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$";

export const passwordMatchValidator = (control: AbstractControl) => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const errors = confirmPassword?.errors || {};

  if( password && confirmPassword && password.value !== confirmPassword.value) {
    // Agregar el error 'passwordMismatch' sin borrar los errores existentes
    errors['passwordMismatch'] = true;
    confirmPassword?.setErrors(errors);
  } else {
    delete errors["passwordMismatch"];
    if (Object.keys(errors).length === 0){
      confirmPassword?.setErrors(null);
    } else {
      confirmPassword?.setErrors(errors);
    }
  }
}
