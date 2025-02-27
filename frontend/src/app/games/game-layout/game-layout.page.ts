import { AlertController } from '@ionic/angular/standalone';
import { StartGameService } from './../services/start-game.service';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonImg, IonButtons, IonButton, IonLabel, IonRow, IonCol, ModalController } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GameBoardDamasComponent } from "../damas/game-board-damas/game-board-damas.component";
import { User } from 'src/app/shared/Interfaces/response.interface';
import { UserCardComponent } from "../../shared/components/user-card/user-card.component";
import { ResultModalComponent } from '../components/result-modal/result-modal.component';
import { RealtimeDatabaseService } from 'src/app/shared/services/realtime-database.service';

@Component({
  selector: 'game-layout',
  templateUrl: './game-layout.page.html',
  styleUrls: ['./game-layout.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
  imports: [IonLabel, IonRow, IonCol, IonHeader, IonToolbar, CommonModule, FormsModule, IonImg, RouterModule, IonContent, IonButtons, IonButton, TranslatePipe, GameBoardDamasComponent, UserCardComponent]
})
export default class GameLayoutPage implements OnInit{

  private route = inject(ActivatedRoute);
  private modalController = inject(ModalController);

  private themeService = inject(ThemeService);
  private startGameService = inject(StartGameService);
  private alertController = inject(AlertController);
  private translate = inject(TranslateService);
  private realtimeDb = inject(RealtimeDatabaseService);


  public gamePath = computed<string>(() => {
    if(this.startGameService.player1() && this.startGameService.player2()){
      return `games/${this.startGameService.player1()?.id}vs${this.startGameService.player2()?.id}`
    }
    return "";
  });
  @ViewChild('modal') modalElement!: ElementRef;
  
  public player1 = computed<User | null>(() => {
    if(this.startGameService.player1()){
      return this.startGameService.player1();
    } else {
      return null;
    }
  })

  public player2 = computed<User | null>(() => {
    if(this.startGameService.player2()){
      return this.startGameService.player2();
    } else {
      return null;
    }
  })
  public logo = computed(() => this.themeService.currentTheme() === "theme-dark" ? "logo-oscuro.webp" : "logo-claro.webp")
  public vs = computed(() => this.themeService.currentTheme() === "theme-dark" ? "vs-claro.webp" : "vs-oscuro.webp")

  public userId = signal<string>(this.route.snapshot.paramMap.get('id')!);
  public oponentId = signal<string>(this.route.snapshot.paramMap.get('idOponent')!);
  public turn = signal<string>("");

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    const oponentId = this.route.snapshot.paramMap.get('idOponent');
    console.log(`Usuario: ${userId}, Oponente: ${oponentId}`);
  }

  changeTurn(value: string) {
    this.turn.set(value);
  }

  async surrender() {
    let alert = await this.alertController.create({
      message: this.translate.instant("GAME.SURRENDER.TEXT"),
      backdropDismiss: true,
      buttons: [
        { 
          text: this.translate.instant("GAME.SURRENDER.CANCEL"), 
          role: 'cancel', 
          cssClass: 'custom-cancel-button',
          handler: () => {
            console.log("No se ha rendido");
          } 
        },
        { 
          text: this.translate.instant("GAME.SURRENDER.SURRENDER"), 
          role: 'confirm', 
          handler: () => {
            console.log("gamePath:",this.gamePath());
            this.realtimeDb.writeData(`${this.gamePath()}/surrender`, true);
            this.showResultModal("LOSE");
          } 
        }
      ]   
    })
    await alert.present();
  }
  
  public async showResultModal(result: 'WIN' | 'LOSE') {
    console.log("Victoria???");
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: { result }
    });
    await modal.present();
  }
}
