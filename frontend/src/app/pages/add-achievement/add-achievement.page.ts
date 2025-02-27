import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput, IonCol, IonRow, IonImg, IonLoading, IonSelect, IonSelectOption, IonTitle } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GamesService } from 'src/app/shared/services/backend/game.service';
import { ProductService } from 'src/app/shared/services/backend/product.service';
import { Game, Response } from 'src/app/shared/Interfaces/response.interface';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { CloudinaryService } from 'src/app/shared/services/backend/cloudinary.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AchievementService } from 'src/app/shared/services/backend/achievement.service';

@Component({
  selector: 'add-product',
  templateUrl: './add-achievement.page.html',
  styleUrls: ['./add-achievement.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonTitle ,IonRow, IonCol, IonButton, IonInput, CommonModule, FormsModule, TranslatePipe, ReactiveFormsModule, IonLoading, IonSelect, IonSelectOption ]
  
})
export default class AddAchievementPage implements OnInit {

  private fb = inject(FormBuilder);
  private gamesService = inject(GamesService);
  private achievementService = inject(AchievementService);
  private cloudinaryService = inject(CloudinaryService);
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);

  public games = signal<Game[] | null>(this.gamesService.games());
  public addAchievementForm = signal<FormGroup>(this.fb.group({
    name: ['', [Validators.required]], 
    reward: ['', [Validators.required]], 
    game: ['', [Validators.required]],  
    level: ['', [Validators.required]],  
  }));

  public isLoading = signal<boolean>(false);
  public langEs = signal<File | null>(null);
  public langEn = signal<File | null>(null);

  public addAchievementDisabled = signal<boolean>(true);
  public currentPieces = signal<string[]| null>(null);

  ngOnInit(): void {
    this.addAchievementForm().valueChanges.subscribe(() => {
      
      this.addAchievementDisabled.set(this.disabledButton());
    })
  }

  addAchievement() {
    if (this.addAchievementForm().valid){
      this.isLoading.set(true);
      this.achievementService.createAchievement(this.addAchievementForm().value.name, this.addAchievementForm().value.reward, this.addAchievementForm().value.game,this.addAchievementForm().value.level)
        .subscribe( ( response: Response ) => {
          console.log("producto creado",response);
          if(response.exito){
            this.cloudinaryService.uploadJson(this.langEn()!, "achievement", response.idAchievement!, "en")
              .subscribe((res:any) => {
                console.log("Traducción subida: ", res);      
              })
            this.cloudinaryService.uploadJson(this.langEs()!, "achievement", response.idAchievement!, "es")
              .subscribe((res:any) => {
                console.log("Traducción subida: ", res);      
              })
            this.toastService.presentToast(this.translate.instant("TOAST.ADD_PRODUCT"), "bottom", "success");
            this.isLoading.set(false);
          }
          this.isLoading.set(false);
        });
    }
  }

  async openFilePicker(fileName: string){
    const result = await FilePicker.pickFiles({
      types: ["application/json"],
      limit: 1,
      readData: true
    });
    const file = result.files[0];
    if (fileName === "es") {
      this.langEs.set(new File([file.blob!], fileName, { type: file.mimeType}));
    } else if (fileName === "en") {
      this.langEn.set(new File([file.blob!], fileName, { type: file.mimeType}));
    }
    this.addAchievementDisabled.set(this.disabledButton());
  }
  

  disabledButton(): boolean{
    if (this.addAchievementForm().valid) {
      if (this.langEn() && this.langEs()){
        return false;
      }
    }
    return true;
  }

}


