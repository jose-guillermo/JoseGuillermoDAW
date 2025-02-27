import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput, IonCol, IonRow, IonImg, IonLoading, IonSelect, IonSelectOption, IonRadio, IonItem, IonRadioGroup, IonLabel, IonTitle } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GamesService } from 'src/app/shared/services/backend/game.service';
import { ProductService } from 'src/app/shared/services/backend/product.service';
import { Game, Response } from 'src/app/shared/Interfaces/response.interface';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { CloudinaryService } from 'src/app/shared/services/backend/cloudinary.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonTitle ,IonImg, IonRow, IonCol, IonButton, IonInput, CommonModule, FormsModule, TranslatePipe, ReactiveFormsModule, IonLoading, IonSelect, IonSelectOption, IonRadio, IonRadioGroup, IonLabel ]
  
})
export default class AddProductPage implements OnInit{

  private fb = inject(FormBuilder);
  private gamesService = inject(GamesService);
  private productService = inject(ProductService);
  private cloudinaryService = inject(CloudinaryService);
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);

  public games = signal<Game[] | null>(this.gamesService.games());
  public addProductForm = signal<FormGroup>(this.fb.group({
    name: ['', [Validators.required]], 
    price: ['', [Validators.required]], 
    game: ['', [Validators.required]],  
    type: ['', [Validators.required]],  
  }));

  public isLoading = signal<boolean>(false);
  public imagesUrl = signal<string[]>([]);
  public images = signal<File[]>([]);

  public addProductDisabled = signal<boolean>(true);
  public currentPieces = signal<string[]| null>(null);

  ngOnInit(): void {
    this.addProductForm().valueChanges.subscribe(() => {
      console.log(this.addProductForm());
      
      this.addProductDisabled.set(this.disabledButton());
    })
  }

  addProduct() {
    if (this.addProductForm().valid){
      this.isLoading.set(true);
      this.productService.createProduct(this.addProductForm().value.name, this.addProductForm().value.price, this.addProductForm().value.game,this.addProductForm().value.type)
        .subscribe( ( response: Response ) => {
          console.log("producto creado",response);
          if(response.exito){
            if(this.images().length > 0) {
              for (let i = 0; i < this.images().length; i++) {
                this.cloudinaryService.uploadImg(this.images()[i]!, "product", response.idProduct!, this.images()[i].name)
                  .subscribe((res:any) => {
                    console.log("Imagen subida: ", res);      
                  })
              }
              
              this.toastService.presentToast(this.translate.instant("TOAST.ADD_PRODUCT"), "bottom", "success");
              this.isLoading.set(false);
            }
          }
          this.isLoading.set(false);
        });
    }
  }

  async openFilePicker(fileName: string){
    const result = await FilePicker.pickImages({
      limit: 1,
      readData: true
    });
  
    if ( result.files.length > 0 ) {
      const file = result.files[0];
      if (this.imagesUrl())
        this.imagesUrl.set([ ...this.imagesUrl()!, "data:image/;base64," + file.data!]);
      else 
        this.imagesUrl.set([ "data:image/;base64," + file.data!]);
  
      if (this.images())
        this.images.set([ ...this.images()! ,new File([file.blob!], fileName, { type: file.mimeType})]);
      else 
        this.images.set([new File([file.blob!], fileName, { type: file.mimeType})]);
  
      this.images()![1].name
    }
    this.addProductDisabled.set(this.disabledButton());
  }
  
  delImage() {
    this.images.set([]);
    this.imagesUrl.set([]);
  }

  changeGame() {
    this.delImage();
    let selectedGame = null;
    
    if (this.addProductForm().value.game !== ""){
      selectedGame = this.games()!.find(game => game.name === this.addProductForm().value.game)
      this.currentPieces.set(selectedGame!.pieces);
    }
    this.addProductDisabled.set(this.disabledButton());
  }

  disabledButton(): boolean{
    if (this.addProductForm().valid) {
      if(this.addProductForm().value.type === "board" && this.images().length === 1) {
        return false;
      }
      if(this.addProductForm().value.type === "pieces" && this.images().length === this.currentPieces()?.length) {
        return false;
      }
    }
    return true;
  }
}
