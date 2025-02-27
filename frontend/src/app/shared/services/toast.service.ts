import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  private toastCtrl = inject(ToastController);

  async presentToast(message: string, position: "top" | "bottom" | "middle", color: string){
    try {
      let toast = null;
      if (position === "top"){
        toast = await this.toastCtrl.create({
          message,
          duration: 3500,  // Duración en milisegundos
          positionAnchor: "header",
          position, // Puede ser 'top', 'middle' o 'bottom'
          color, // Puedes usar un color como 'primary', 'secondary', 'danger', etc.
        });
      } else if (position === "bottom") {
        toast = await this.toastCtrl.create({
          message,
          duration: 3500,  // Duración en milisegundos
          positionAnchor: "footer",
          position, // Puede ser 'top', 'middle' o 'bottom'
          color, // Puedes usar un color como 'primary', 'secondary', 'danger', etc.
        });
      } else {
        toast = await this.toastCtrl.create({
          message,
          duration: 3500,  // Duración en milisegundos
          position, // Puede ser 'top', 'middle' o 'bottom'
          color, // Puedes usar un color como 'primary', 'secondary', 'danger', etc.
        });
      }

      await toast.present();
    } catch (error) {
      console.error("Error presenting", error);
    }
  }
}
