import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FooterComponent } from "../shared/components/footer/footer.component";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../shared/components/header/header.component";
import { DownloadButtonComponent } from "../shared/components/download-button/download-button.component";
import { SideMenuComponent } from "../shared/components/side-menu/side-menu.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonContent, FooterComponent, RouterModule, HeaderComponent, DownloadButtonComponent, SideMenuComponent],
})
export default class  LagoutPage {

}
