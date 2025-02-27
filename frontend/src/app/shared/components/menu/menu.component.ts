import { ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { IonMenuButton, IonButtons, IonButton, IonIcon, IonSelect, IonSelectOption, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, sunny, logIn, camera, settings } from 'ionicons/icons';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { TranslatorService } from '../../services/translator.service';
import { UserService } from '../../services/backend/user.service';
import { Message, User } from '../../Interfaces/response.interface';
import { MessagesService } from '../../services/backend/messages.service';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'shared-component-menu',
  styleUrls: ['./menu.component.scss'],
  templateUrl: './menu.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonBadge,  IonIcon,  IonButton, IonButtons, IonicStorageModule, IonSelect, IonSelectOption, TranslatePipe, RouterModule, IonMenuButton, UserCardComponent ],
})
export class MenuComponent {

  private themeService = inject(ThemeService);
  private translatorService = inject(TranslatorService);
  private userService = inject(UserService);
  private messagesService = inject(MessagesService);

  public themeIcon = computed<string>(() => this.themeService.currentTheme() === "theme-dark" ? "moon" : "sunny");
  public selectedLang = computed<string>(() => this.translatorService.currentLang() || "es");
  public user = computed<User | null>(() => this.userService.user());
  public userLogin = computed<boolean>(() => this.userService.user() ? true : false);

  public isAdmin = computed<boolean>(() => {
    if(this.userService.user()) {
      return this.userService.user()!.rol === "admin" ? true : false;
    }
    return false;
  })

  public numNoReadMessages = computed<number>(() => {
    if(this.messagesService.messages()){
      const noReadMessages = this.messagesService.messages()!.filter( (message: Message) => !message.read);
      return noReadMessages.length;
    } else {
      return 0;
    }
  });

  constructor() {
    addIcons({logIn,settings,camera,moon,sunny});
  }

  changeTheme() {
    this.themeService.changeTheme();
  }

  changeLanguage( event: CustomEvent ) {
    this.translatorService.changeLang( event.detail.value )
  }

  
  logout() {
    console.log("Intentando eliminar sesión");
    this.userService.logout()
      .subscribe((res) => {
        console.log(res);
      });
  }

}
