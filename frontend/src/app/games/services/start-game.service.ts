import { HttpClient } from '@angular/common/http';
import { UserService } from './../../shared/services/backend/user.service';
import { inject, Injectable, signal } from '@angular/core';
import { Game, Response, User } from 'src/app/shared/Interfaces/response.interface';
import { GamesService } from 'src/app/shared/services/backend/game.service';
import { environment } from 'src/environments/environment';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class StartGameService {

  private userService = inject(UserService);
  private gamesService = inject(GamesService);
  private http = inject(HttpClient);  

  public player1 = signal<User | null>(null);
  public player2 = signal<User | null>(null);
  public isPlayer1 = signal<boolean | null>(null);

  public game = signal<Game | null>(null);
  constructor() { }


  setGame(idGame: string) {
    this.game.set(this.gamesService.games()!.find((game) => game.id == idGame)!)
  }

  setPlayer1(idUser: string) {
    if (idUser == this.userService.user()!.id ) {
      this.player1.set(this.userService.user());
      this.isPlayer1.set(true);
    } else {
      this.isPlayer1.set(false);
      let url = `${ URL }/db/user/getUser.php?idUsuario=${idUser}`
      this.http.get<Response>( url, { withCredentials: true } )
        .subscribe(( res: Response) => {
          console.log("jugador 1:", res.user);

          this.player1.set(res.user!);
        })
    }
  }

  setPlayer2(idUser: string) {
    if (idUser == this.userService.user()!.id ) {
      this.player2.set(this.userService.user())
    } else {
      let url = `${ URL }/db/user/getUser.php?idUsuario=${idUser}`
      this.http.get<Response>( url, { withCredentials: true } )
        .subscribe(( res: Response) => {
          console.log("jugador 2:", res.user);
          
          this.player2.set(res.user!);
        })
    }
  }
}
