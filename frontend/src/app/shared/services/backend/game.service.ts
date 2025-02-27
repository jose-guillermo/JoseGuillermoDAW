import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Game, Response } from '../../Interfaces/response.interface';
import { DataLocalService } from '../data-local.service';
import { ToastService } from '../toast.service';
import { environment } from 'src/environments/environment';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private http = inject(HttpClient);
  private dataLocal = inject(DataLocalService);
  private toastSevice = inject(ToastService);
  private translate = inject(TranslateService);

  public games = signal<Game[] | null>(null);

  constructor() {
    effect(() => {
      this.dataLocal.setValue("games", this.games());
    });
    this.gamesInit();
      
    this.getGames()
      .subscribe((res: Response) => {
        console.log(res);
        
        if(res.exito) {
          this.games.set(res.juegos!);
          console.log(this.games);
        }
      })
  }
  
  gamesInit(){
    this.dataLocal.getValue("games").then((games: Game[]) => {
      if(games)
        this.games.set(games);
      });
  }
  
  getGames():Observable<Response> {
    const url = `${ URL }/db/game/games.php`
    return this.http.get<Response>(url, { withCredentials: true })
  }

  createGame(name: string, pieces: string[]){
    const formData = new FormData();
    formData.append('nombre', name);
    formData.append('piezas', JSON.stringify(pieces));
    
    const url = `${ URL }/db/game/create.php`

    return this.http.post<Response>(url, formData, { withCredentials: true });
  }
}
