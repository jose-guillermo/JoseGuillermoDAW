import { effect, inject, Injectable, signal } from '@angular/core';

import { Achievement, Response } from '../../Interfaces/response.interface';
import { HttpClient } from '@angular/common/http';
import { DataLocalService } from '../data-local.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  private http = inject(HttpClient);
  private dataLocal = inject(DataLocalService);
  public level = signal<string[]>(["DIAMOND", "GOLD", "SILVER", "COPPER"]);
  public achievements = signal<Achievement[] | null>(null);
  public favouriteAchievement = signal<Achievement | null>(null);

  constructor() {
    effect(() => {
      this.dataLocal.setValue("achievements", this.achievements());
    });
    this.achievementsInit();
        
    this.getAchievements()
      .subscribe((res: Response) => {
        console.log(res);
          
        if(res.exito) {
          this.achievements.set(res.logros!);
          console.log(this.achievements);
        }
      })
  }
    
  achievementsInit(){
    this.dataLocal.getValue("achievements").then((achievements: Achievement[]) => {
      if(achievements)
        this.achievements.set(achievements);
      });
  }
    
  getAchievements():Observable<Response> {
      const url = `${ URL }/db/achievement/achievements.php`
    return this.http.get<Response>(url, { withCredentials: true })
  }

  createAchievement(nombre: string, recompensa: string, juego: string, nivel: string): Observable<Response> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('recompensa', recompensa);
    formData.append('juego', juego);
    formData.append('nivel', nivel);
  
    const url = `${URL}/db/achievement/add.php`;
  
    return this.http.post<Response>(url, formData, { withCredentials: true });
  }
  
}
