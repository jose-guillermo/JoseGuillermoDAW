import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Game, Product, Response } from '../../Interfaces/response.interface';
import { DataLocalService } from '../data-local.service';
import { ToastService } from '../toast.service';
import { environment } from 'src/environments/environment';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private dataLocal = inject(DataLocalService);
  private toastSevice = inject(ToastService);
  private translate = inject(TranslateService);

  public products = signal<Product[] | null>(null);

  constructor() {
    effect(() => {
      this.dataLocal.setValue("products", this.products());
    });
    this.productsInit();
      
    this.getProducts()
      .subscribe((res: Response) => {
        console.log(res);
        
        if(res.exito) {
          this.products.set(res.productos!);
          console.log(this.products);
        }
      })
  }
  
  productsInit(){
    this.dataLocal.getValue("products").then((products: Product[]) => {
      if(products)
        this.products.set(products);
      });
  }
  
  getProducts():Observable<Response> {
    const url = `${ URL }/db/product/products.php`
    return this.http.get<Response>(url, { withCredentials: true })
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
