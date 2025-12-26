import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastController: ToastController) {}

  async showError(message: string) {
    const toast = await this.toastController.create({
      header: message,
      duration: 3000,
      color: 'danger',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });

    await toast.present();
  }

  async showSuccess(message: string) {
    const toast = await this.toastController.create({
      header: message,
      duration: 3000,
      color: 'success',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'Fermer',
          },
        },
      ],
    });

    await toast.present();
  }
}
