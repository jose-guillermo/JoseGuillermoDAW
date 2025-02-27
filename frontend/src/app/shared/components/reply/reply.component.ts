import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonCard, IonCardContent, IonInput, IonTextarea, IonLoading, ModalController } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessagesService } from '../../services/backend/messages.service';
import { Response } from '../../Interfaces/response.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonInput, IonTextarea, TranslatePipe, IonLoading, ReactiveFormsModule],
  
})
export class ReplyComponent {

  private fb = inject(FormBuilder);
  private messagesService = inject(MessagesService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService)
  private modalCtrl = inject(ModalController);

  public isLoading = signal<boolean>(false);
  
  @Input({required: true}) sender: string = "";
  
  public replyForm = signal<FormGroup>(this.fb.group({
    subject: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
  }));

  constructor() { };

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  sendMessage(){
    if (this.replyForm().valid) {
      this.isLoading.set(true);
      this.messagesService.sendMessage( this.sender, this.replyForm().get("subject")?.value, this.replyForm().get("body")?.value, "ADMIN_REPLY")
        .subscribe( ( res: Response ) => {
          console.log(res);
          if( res.exito ){
            this.toastService.presentToast(this.translate.instant("TOAST.REPLY_MESSAGE"),"top", "success")
            this.replyForm().reset({ type: "SUGGESTION" })
          } else {
            console.log(res);
          }
          this.isLoading.set(false);
          this.close()
        })
    }
  }
}
