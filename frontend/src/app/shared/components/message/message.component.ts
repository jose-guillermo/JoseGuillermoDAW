import { AnimationService } from './../../services/animation.service';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ModalController, IonTitle, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowForwardOutline, add } from 'ionicons/icons';

import { Message, User } from '../../Interfaces/response.interface';
import { MessagesService } from '../../services/backend/messages.service';
import { UserService } from '../../services/backend/user.service';
import { RouterModule } from '@angular/router';
import { ReplyComponent } from '../reply/reply.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, IonCardContent, IonCardHeader, IonCard, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, IonTitle, TranslatePipe, DatePipe, RouterModule],
})
export class MessageComponent{

  private modalCtrl = inject(ModalController);
  // private messagesService = inject(MessagesService);
  private userService = inject(UserService);
  private animationService = inject(AnimationService);

  @Input({required: true}) message: Message | null = null;
  @Input({required: true}) index: number = 0;
  @Input({required: true}) disablePrevious: boolean = false;
  @Input({required: true}) disableNext: boolean = false;
  @Output() modalNextPrevious = new EventEmitter<string>();

  public user = computed<User | null>(() => this.userService.user());

  constructor() {
    addIcons({arrowBackOutline,add,arrowForwardOutline});
  }
  
  async replyMessage() {
    let modal = await this.modalCtrl.create({
      component: ReplyComponent,
      componentProps: {
        sender: this.message?.sender,        
      },
      enterAnimation: this.animationService.enterAnimation,
      leaveAnimation: this.animationService.leaveAnimation
    });

    this.close();

    await modal.present();
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  previous() {
    return this.modalCtrl.dismiss({ index: this.index - 1, previous: true});
  }

  next() {
    return this.modalCtrl.dismiss({ index: this.index + 1, previous: false});
  }

}
