import { GamesService } from './../../shared/services/backend/game.service';

import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonAlert, AlertController  } from "@ionic/angular/standalone";

import { UserCardComponent } from "../../shared/components/user-card/user-card.component";
import { UserService } from 'src/app/shared/services/backend/user.service';
import { Game, User } from 'src/app/shared/Interfaces/response.interface';
import { SearchGameService } from 'src/app/shared/services/search-game.service';
import { register } from 'swiper/element/bundle';
import { ImagePipe } from 'src/app/shared/pipes/image.pipe';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

register();
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [IonButton, RouterModule, ImagePipe, TranslatePipe ],
})
export default class HomePage implements OnInit {

  private userService = inject(UserService);
  private gamesService = inject(GamesService);
  private searchGameService = inject(SearchGameService);
  private breakpointObserver = inject(BreakpointObserver);
  private alertController = inject(AlertController);
  private translate = inject(TranslateService);
  private router = inject(Router);

  public user = computed<User | null>(() => this.userService.user());
  public games = computed<Game[] | null>(() => this.gamesService.games());
  public slidesPerView = signal<number>(0);

  public isUser = computed<boolean>(() => {
    if(this.userService.user()) {
      return this.userService.user()!.rol === "user" ? true : false;
    }
    return false;
  })
  
  constructor(){
    this.breakpointObserver.observe([
      Breakpoints.XSmall, // Móviles
      Breakpoints.Small,  // Tablets pequeñas
      Breakpoints.Medium, // Tablets grandes
      Breakpoints.Large,  // Monitores pequeños
      Breakpoints.XLarge  // Monitores grandes
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.slidesPerView.set(1);
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.slidesPerView.set(3);
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.slidesPerView.set(3.5);
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.slidesPerView.set(4.3);
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        this.slidesPerView.set(5.3);
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.alertController.dismiss().then(() => {
        console.log("Partida encontrada");
        
      });
    });
  }

  async searchGame(gameId: string) {
    console.log(this.user());
    this.searchGameService.searchGame(gameId);
    let alert = await this.alertController.create({
      message: this.translate.instant("HOME.SEARCHING_GAME"),
      backdropDismiss: false,
      buttons: [
        { 
          text: this.translate.instant("HOME.CANCEL_SEARCH_GAME"), 
          role: 'cancel', 
          cssClass: 'custom-cancel-button',
          handler: () => {
            this.searchGameService.cancelSearch(gameId);
          } 
        }
      ]   
    })
    await alert.present();
  }

  onImageError( ev: any ){
    ev.target.src = 'assets/default-profile-img.webp'; // Ruta de la imagen predeterminada
  }

}
