import { filter } from 'rxjs';
import { Game, Product } from './../../shared/Interfaces/response.interface';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCardHeader, IonCol, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { ProductService } from 'src/app/shared/services/backend/product.service';
import { GamesService } from 'src/app/shared/services/backend/game.service';
import { ImagePipe } from 'src/app/shared/pipes/image.pipe';

register()

@Component({
  selector: 'shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [ CommonModule, FormsModule, IonRow, IonCardHeader, IonCol, IonCard, IonCardTitle, IonCardContent, IonButton, ImagePipe ]
})
export default class ShopPage {

  private productService = inject(ProductService);
  private gamesService = inject(GamesService);

  public games = computed<Game[] | null>(() => this.gamesService.games())
  public products = computed<Product[] | null>(() => this.productService.products())
  constructor() { }

  onImageError( ev: any ){
    ev.target.src = 'assets/default-profile-img.webp'; // Ruta de la imagen predeterminada
  }

  getAllPieces(gameId: string): string[] {
    let game = this.games()!.filter((game) => game.id === gameId);
    return game[0].pieces;
  }
}
