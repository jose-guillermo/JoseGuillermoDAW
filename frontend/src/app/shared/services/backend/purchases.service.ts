import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Product, Response } from '../../Interfaces/response.interface';
import { DataLocalService } from '../data-local.service';
import { ToastService } from '../toast.service';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  private http = inject(HttpClient);
  private dataLocal = inject(DataLocalService);
  private userService = inject(UserService);
  private userId = computed<string>(() => this.userService.user()!.id);
  
  public purchases = signal<string[]>([]);
  
  constructor() {
    effect(() => {
      this.dataLocal.setValue("purchases", this.purchases());
    });
    this.purchasesInit();
        
    this.getPurchases()
      .subscribe((res: Response) => {
        console.log(res);
          
        if(res.exito) {
          this.purchases.set(res.compras!);
          console.log(this.purchases);
        }
      })
  }
    
  purchasesInit(){
    this.dataLocal.getValue("purchases").then((purchases: string[]) => {
      if(purchases)
        this.purchases.set(purchases);
      });
  }
    
  getPurchases():Observable<Response> {
    const url = `${ URL }/db/purchase/purchases.php?idUsuario=${this.userId()}`;
    return this.http.get<Response>(url,{ withCredentials: true })
  }
  
  createProduct(nombre: string, precio: string, juego: string, tipo: string): Observable<Response> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('juego', juego);
    formData.append('tipo', tipo);
    
    const url = `${URL}/db/product/add.php`;
    
    return this.http.post<Response>(url, formData, { withCredentials: true });
  }
}
