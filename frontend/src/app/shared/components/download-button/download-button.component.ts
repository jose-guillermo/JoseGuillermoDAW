import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { IonButton, IonToast } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { download } from 'ionicons/icons';
import { Platform } from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { DataLocalService } from '../../services/data-local.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'shared-component-download-button',
  templateUrl: './download-button.component.html',
  styleUrls: ['./download-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonToast,  IonButton, TranslatePipe ],
})
export class DownloadButtonComponent  implements OnInit, OnDestroy {

  @ViewChild('openToast', { static: false }) toast!: IonToast;

  public showInstallButton = signal<boolean>(false);

  private deferredPrompt = signal<any>(null);
  private subscription = signal<Subscription | null>(null);

  private platform = inject(Platform);
  private router = inject(Router);
  private dataLocal = inject(DataLocalService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', async (event) => {
      // Prevenir que el navegador muestre el banner de instalación predeterminado
      event.preventDefault();
      this.deferredPrompt.set(event);

      addIcons({ download });
      // this.dismissedDownload();
      const dismissed = await this.dismissedDownload();

      if (this.isMobile() && dismissed){

        this.showInstallButton.set(this.router.url === '/home');
        this.subscription.set(this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(() => {

            this.showInstallButton.set(this.router.url === '/home');
          })
        )
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription()?.unsubscribe();
  }

  private async dismissedDownload(){
    const download = await this.dataLocal.getValue("download");

    if (download === "dismissed"){
      return false;
    }
    return true;
  }


  private isMobile(): boolean {
    return this.platform.is("ios") || this.platform.is("android");
  }

  public installApp() {
    if (this.deferredPrompt()) {
      // Muestra el cuadro de diálogo de instalación
      this.deferredPrompt().prompt();
      this.deferredPrompt().userChoice.then((choiceResult: any) => {

        if (choiceResult.outcome === 'accepted') {
          this.showInstallButton.set(false);
        }

        if (choiceResult.outcome === 'dismissed') {
          this.showInstallButton.set(false);
          this.dataLocal.setValue( "download", "dismissed");
          this.subscription()!.unsubscribe();
          this.toastService.presentToast(this.translate.instant("TOAST.INSTALL_DISMISS"), "middle", "secondary");
        }

        this.deferredPrompt.set(null) // Reinicia el objeto deferredPrompt
      });
    }
  }

}
