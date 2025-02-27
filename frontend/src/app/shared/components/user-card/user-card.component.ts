import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, OnInit } from '@angular/core';
import { IonLabel, IonCard, IonAvatar, IonImg, IonItem } from "@ionic/angular/standalone";
import { ImagePipe } from '../../pipes/image.pipe';
import { AchievementService } from '../../services/backend/achievement.service';
import { UserService } from '../../services/backend/user.service';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslatorService } from '../../services/translator.service';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../Interfaces/response.interface';

// export function ComponentLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   console.log("cambiando traducción");

//   return new TranslateHttpLoader(http, './assets/achievement/', '.json');
// }

export function createGameTranslateLoader(http: HttpClient, game: string) {
  return new TranslateHttpLoader(http, `./assets/i18n/${game}/`, '.json');
}
@Component({
  selector: 'shared-component-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonItem, IonImg, IonAvatar, IonCard, IonLabel, ImagePipe, TranslateModule, TranslateModule ],
})
export class UserCardComponent{

  private achievementService = inject(AchievementService);
  private translatorService = inject(TranslatorService);

  @Input({required: true}) user: any;
  
  public achievement = computed<string>(() => this.achievementService.favouriteAchievement() ? "TITLE" : "NO_FAVOURITE_ACHIEVEMENT");

  constructor() {
    this.translatorService.changeLangFiles("dsaf");
  }

  onImageError( ev: any ){
    ev.target.src = 'assets/default-profile-img.webp'; // Ruta de la imagen predeterminada
  }
}
