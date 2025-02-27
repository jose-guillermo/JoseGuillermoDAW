import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './shared/services/theme.service';
import { TranslatorService } from './shared/services/translator.service';
import { UserService } from './shared/services/backend/user.service';
import { GamesService } from './shared/services/backend/game.service';
import { ProductService } from './shared/services/backend/product.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private userService = inject(UserService);
  private themeService = inject(ThemeService);
  private translatorService = inject(TranslatorService);
  private gamesService = inject(GamesService);
  private productService = inject(ProductService);

}
