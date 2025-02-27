import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonRadio, IonButton, IonTextarea, IonCardTitle, IonCard, IonCardSubtitle, IonCardHeader, IonCardContent, IonInput, IonRadioGroup, IonLoading } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { MessagesService } from 'src/app/shared/services/backend/messages.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Response } from 'src/app/shared/Interfaces/response.interface';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonRadioGroup, IonInput, IonCardContent, IonCardHeader, IonCardSubtitle, IonCard, IonCardTitle, IonTextarea, IonButton, TranslatePipe, CommonModule, FormsModule, ReactiveFormsModule, IonRadio, IonLoading]
})
export default class FeedbackPage {

  private fb = inject(FormBuilder);
  private messagesService = inject(MessagesService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService)

  public messageForm = signal<FormGroup>(this.fb.group({
    subject: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
    type: ['SUGGESTION', [Validators.required ,Validators.pattern(/^(BUG|SUGGESTION)$/)]]
  }));

  public isLoading = signal<boolean>(false);

  sendMessage(){
    if (this.messageForm().valid) {
      this.isLoading.set(true);
      this.messagesService.sendMessage( "1", this.messageForm().get("subject")?.value, this.messageForm().get("body")?.value, this.messageForm().get("type")?.value)
        .subscribe( ( res: Response ) => {
          console.log(res);
          if( res.exito ){
            this.toastService.presentToast(this.translate.instant("TOAST.FEEDBACK_PAGE"),"top", "success")
            this.messageForm().reset({ type: "SUGGESTION" })
          } else {
            console.log(res);
          }
          this.isLoading.set(false);
        })
    }
  }

}
