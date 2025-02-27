import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonInput, IonRow, IonCol, IonButton, IonList, IonLabel, IonItem, IonIcon, IonLoading, IonImg, IonTitle } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Game, Response } from 'src/app/shared/Interfaces/response.interface';
import { CloudinaryService } from 'src/app/shared/services/backend/cloudinary.service';
import { GamesService } from 'src/app/shared/services/backend/game.service';
import { ProductService } from 'src/app/shared/services/backend/product.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { single } from 'rxjs';
import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'add-game',
  templateUrl: './add-game.page.html',
  styleUrls: ['./add-game.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonTitle ,IonImg ,IonLoading ,TranslatePipe, CommonModule, FormsModule, ReactiveFormsModule, IonInput, IonRow, IonCol, IonButton, IonList, IonLabel, IonItem, IonIcon]
})
export default class AddGamePage implements OnInit {


  private fb = inject(FormBuilder);
  private gamesService = inject(GamesService);
  private productService = inject(ProductService); 
  private gameService = inject(GamesService); 
  private cloudinaryService = inject(CloudinaryService);
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);

  public isLoading = signal<boolean>(false);
  public games = signal<Game[] | null>(this.gamesService.games());
  public addGameForm = signal<FormGroup>(this.fb.group({
    name: ['', [Validators.required]], 
    piece: [''], 
  }));

  public pieces = signal<string[]>([]);
  public addGameDisabled = signal<boolean>(true);

  public thumbnailImgUrl = signal<string>("");
  public thumbnailImg = signal<File | null>(null);

  public piecesImgsUrl = signal<string[]>([]);
  public piecesImgs = signal<File[]>([]);

  public boardImgUrl = signal<string>("");
  public boardImg = signal<File | null>(null);

  constructor() {
    addIcons({trashBin});
  }

  ngOnInit() {
    this.addGameForm().valueChanges.subscribe(() => {
      
      this.addGameDisabled.set(this.disabledButton());
    })
  }
  
  addGame() {
    if (this.addGameForm().valid){
      this.isLoading.set(true);
      this.gameService.createGame(this.addGameForm().value.name, this.pieces())
        .subscribe( ( response: Response ) => {
          console.log("juego creado",response);
          if(response.exito){
            this.cloudinaryService.uploadImg(this.thumbnailImg()!, "game", response.idGame!, "thumbnail")
              .subscribe( (res: any) => {
                console.log("Imagen subida: ", res);      
              })
            this.productService.createProduct(`${this.addGameForm().value.name}_default_board`, "0", this.addGameForm().value.name, "board")
              .subscribe( (boardResponse: Response) => {
                this.cloudinaryService.uploadImg(this.boardImg()!, "product", boardResponse.idProduct!, "board")
                  .subscribe((res:any) => {
                    console.log("Imagen subida: ", res);      
                  })
              })
            this.productService.createProduct(`${this.addGameForm().value.name}_default_pieces`, "0", this.addGameForm().value.name, "pieces")
              .subscribe( (piecesResponse: Response) => {
                for (let i = 0; i < this.piecesImgs().length; i++) {
                  this.cloudinaryService.uploadImg(this.piecesImgs()[i]!, "product", piecesResponse.idProduct!, this.piecesImgs()[i].name)
                    .subscribe((res:any) => {
                      console.log("Imagen subida: ", res);      
                    })
                }
              })
            
            this.toastService.presentToast(this.translate.instant("TOAST.ADD_PRODUCT"), "bottom", "success");
            this.isLoading.set(false);
          }
          this.isLoading.set(false);
        });
    }
  }

  addPiece() {
    console.log("piezas",this.pieces());
    console.log("pieza para añadir",this.addGameForm().value.piece);

    
    if(this.addGameForm().value.piece !== "") {
      this.pieces.set([...this.pieces(), this.addGameForm().value.piece])
    }
  }

  async openFilePicker(fileName: string){
    const result = await FilePicker.pickImages({
      limit: 1,
      readData: true
    });

    if ( result.files.length > 0 ) {
      const file = result.files[0];
      if ( fileName === "board") {
        this.boardImgUrl.set( "data:image/;base64," + file.data!);
        this.boardImg.set(new File([file.blob!], fileName, { type: file.mimeType}));

      } else if (fileName === "thumbnail") {
        this.thumbnailImgUrl.set( "data:image/;base64," + file.data!);
        this.thumbnailImg.set(new File([file.blob!], fileName, { type: file.mimeType}));
      } else {
        if (this.piecesImgsUrl())
          this.piecesImgsUrl.set([ ...this.piecesImgsUrl()!, "data:image/;base64," + file.data!]);
        else 
          this.piecesImgsUrl.set([ "data:image/;base64," + file.data!]);
    
        if (this.piecesImgs())
          this.piecesImgs.set([ ...this.piecesImgs()! ,new File([file.blob!], fileName, { type: file.mimeType})]);
        else 
          this.piecesImgs.set([new File([file.blob!], fileName, { type: file.mimeType})]);
      } 

      this.addGameDisabled.set(this.disabledButton());
    }
  }

  deletePiece(piece: string) {
    this.pieces.update(items => items.filter(element => element !== piece));
  }

  disabledButton(): boolean {
    if (this.addGameForm().valid) {
      if(this.pieces().length !== 0 && this.piecesImgs().length === this.pieces().length * 2 && this.boardImg() !== null && this.thumbnailImg() !== null){
        return false;
      }
    }
    return true;
  }
}
