import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonImg } from "@ionic/angular/standalone";
import { RouterModule } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'shared-component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ IonHeader, IonToolbar, IonImg, MenuComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeaderComponent {

  public logo = computed(() => this.themeService.currentTheme() === "theme-dark" ? "logo-oscuro.webp" : "logo-claro.webp")

  private themeService = inject(ThemeService);

  constructor() { }


}
