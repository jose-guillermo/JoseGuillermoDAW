import { computed, inject, Injectable, signal } from '@angular/core';
import { onValue, ref, Unsubscribe } from 'firebase/database';
import { UserService } from './backend/user.service';
import { database, RealtimeDatabaseService } from './realtime-database.service';
import { Router } from '@angular/router';
import { GamerSearching } from '../Interfaces/realtimeDb.interface';
import { StartGameService } from 'src/app/games/services/start-game.service';

@Injectable({
  providedIn: 'root'
})
export class SearchGameService {

  private realtimeDb = inject(RealtimeDatabaseService);
  private userService = inject(UserService);
  private router = inject(Router);
  private startGameService = inject(StartGameService)

  private unsubscribe = signal<Unsubscribe | null>(null);
  public gameStarted = signal<boolean>(false);
  private userId = computed<string>(() => this.userService.user()!.id);

  constructor() { }

  async searchGame(gameId: string) {
    const path = `searchGame/${ gameId }`;
    const gamers = await this.realtimeDb.getData(path) || {};

    const [existingId] = Object.keys(gamers);

    if (existingId && !gamers[existingId].oponent && existingId !== this.userId()) {
      // Emparejar con el usuario
      this.realtimeDb.writeData(`${path}/${existingId}`, { oponent: this.userId() });

      // Iniciar partida de inmediato
      this.startGameService.setPlayer1(existingId);
      this.startGameService.setPlayer2(this.userId());

      this.realtimeDb.writeData(`games/${existingId}vs${this.userId()}`, { "comenzado": 1 } );
      this.gameStarted.set(true);
      this.router.navigate(["/game-layout", existingId, this.userId()]);
    } else {
      // No hay nadie esperando, creamos nuestro propio registro
      this.realtimeDb.writeData(`${path}/${this.userId()}`, { oponent: "" });

      // Escuchar cambios en nuestro propio registro
      const userRef = ref(database, `${path}/${this.userId()}`);
      this.unsubscribe.set(onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data?.oponent) {
          // Hemos sido emparejados por otro jugador
          this.realtimeDb.writeData(`${path}/${this.userId()}`, null );

          this.gameStarted.set(true);
          this.startGameService.setPlayer1(this.userId());
          this.startGameService.setPlayer2(data.oponent);
          this.router.navigate(["/game-layout", this.userId(), data.oponent]);

          // Detener la escucha después de emparejarnos
          this.unsubscribe()?.();
        }
      }));
    }
  }

  public async cancelSearch(gameId: string) {
    if(this.unsubscribe()) {
      const path = `searchGame/${ gameId }`;
      this.realtimeDb.writeData(`${ path }/${this.userId()}`, null)

      this.unsubscribe()?.()
    }
  }
  
}
