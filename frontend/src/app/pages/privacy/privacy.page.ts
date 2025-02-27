import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonTitle } from "@ionic/angular/standalone";
import { TranslatePipe } from "@ngx-translate/core";
import { addIcons } from 'ionicons';
import { caretDownCircle } from 'ionicons/icons';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonTitle, IonItem, IonLabel,  CommonModule, FormsModule, TranslatePipe, IonAccordionGroup, IonAccordion ]
})
export default class PrivacyPage {

  constructor() {
    addIcons({ caretDownCircle })
  }

}
