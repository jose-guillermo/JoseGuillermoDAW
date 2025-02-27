import { ModalController, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonContent, IonButton, CommonModule, TranslatePipe ],
})
export class ResultModalComponent {
  
  private modalController = inject(ModalController);
  private router = inject(Router);
  
  @Input({required: true}) result: 'WIN' | 'LOSE' = 'LOSE';

  closeModal() {
    this.router.navigate(["/home"]);
    this.modalController.dismiss();
  }
}
