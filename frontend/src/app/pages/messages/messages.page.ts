import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTitle, IonLabel, IonList, IonItem, IonButton, IonIcon, ModalController, IonSegment, IonSegmentButton} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { trashBin, chatbubbles, mail } from 'ionicons/icons';

import { Message, User } from 'src/app/shared/Interfaces/response.interface';
import { MessagesService } from '../../shared/services/backend/messages.service';
import { MessageComponent } from 'src/app/shared/components/message/message.component';
import { AnimationService } from '../../shared/services/animation.service';
import { UserService } from 'src/app/shared/services/backend/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, IonButton, IonItem, IonList, IonLabel,  CommonModule, FormsModule, TranslatePipe, IonTitle, IonSegment, IonSegmentButton]
})
export default class MessagesPage implements OnInit {


  private messagesService = inject(MessagesService);
  private modalCtrl = inject(ModalController);
  private animationService = inject(AnimationService);

  public types = computed<string[] | []> (() => {
    if (this.messagesService.messages()){
      let uniqueTypes: string[] = [...new Set(this.messagesService.messages()!.map((message) => message.type))];
      return uniqueTypes;
    }
    return [];
  })
  public filter = signal<string | null>(null);
  public messages = computed<Message[] | null>(() => {
    if (this.messagesService.messages()){
      if (this.filter()) {
        const filterMessages: Message[] = this.messagesService.messages()!.filter((message) => message.type === this.filter());
        return filterMessages;
      }
    }

    return this.messagesService.messages();
  })
  // public messages = signal<Message[] | null>(null);
  
  constructor() {
    addIcons({mail,trashBin,chatbubbles});
  }

  ngOnInit(): void {
    console.log("Mensajes en la página", this.messages());
  }

  changeFilter(ev: any) {
    this.filter.set(ev.detail.value);
  }

  async showMessage(message: Message, i: number, previous: boolean | null = null) {
    if (!(message.read)) {
      this.messagesService.markReadMessage(message.id)
    }
    
    let disablePrevious = false;
    let disableNext = false;

    if (i === 0)
      disablePrevious = true;

    if(i === this.messages()!.length - 1)
      disableNext = true;

    let modal = null
    if(previous) {
      modal = await this.modalCtrl.create({
        component: MessageComponent,
        componentProps: {
          message: message,
          index: i,
          disableNext,
          disablePrevious
        },
        enterAnimation: this.animationService.enterAnimationLeft,
        leaveAnimation: this.animationService.leaveAnimation,
      });
    } else if (previous === false) {
      modal = await this.modalCtrl.create({
        component: MessageComponent,
        componentProps: {
          message: message,
          index: i,
          disableNext,
          disablePrevious
        },
        enterAnimation: this.animationService.enterAnimationRight,
        leaveAnimation: this.animationService.leaveAnimation,
      });
    } else {
      modal = await this.modalCtrl.create({
        component: MessageComponent,
        componentProps: {
          message: message,
          index: i,
          disableNext,
          disablePrevious
        },
        enterAnimation: this.animationService.enterAnimation,
        leaveAnimation: this.animationService.leaveAnimation,
      });
    }


    modal.onDidDismiss().then( async (result) => {
      if (result.data){
        const data = result.data;  // Aquí obtienes el valor emitido desde el modal
        if (data.index !== null)
          this.showMessage(this.messages()![data.index], data.index, data.previous);
      }
      console.log("Mostrar mensajes en mensajes", this.messages());
    })

    await modal.present();
  }

  deleteMessage( id: string ) {
    this.messagesService.deleteMessage(id);
  }
}
