import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { DataLocalService } from '../data-local.service';
import { Observable } from 'rxjs';


const APIURL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService{


  private httpClient = inject(HttpClient);

  /**
   * Subirá la imagen a cloudinary y devolverá el Observable
   *
   * @param file La imagen que será subida
   * @param dir El directorio donde se subirá
   * @param id El id de la entidad a la que pertenece, si es una imagen de un juego será el id del juego
   * @param idImg Lo que representa la imagen, si es una imagen de perfil, se llamará perfil
   */
  uploadImg(file: File, dir: string, id: string, idImg: string):Observable<Response> {
    // Preparo el archivo para enviarlo
    let formData = new FormData();
    
    // Añado los parámetros a la url
    formData.append("image", file);
    formData.append("dir", dir);
    formData.append("id", id);
    formData.append("idImage", idImg);
    const url = `${APIURL}/cloudinary/upload_img.php`

    // Envío la petición
    return this.httpClient.post<Response>( url, formData, { withCredentials: true });
  }

  /**
   * Subirá el json a cloudinary y devolverá el Observable
   *
   * @param file El json que contendrá la traducción
   * @param dir El directorio donde se subirá
   * @param id El id de la entidad a la que pertenece, si es una traducción de un juego será el id del juego
   * @param lang El idioma que guarda el json, si es español será es.
   */
  uploadJson(file: File, dir: string, id: string, lang: "es" | "en") {
    // Preparo el archivo para enviarlo
    let formData = new FormData();
    formData.append("json", file);

    // Añado los parámetros a la url
    formData.append("dir", dir);
    formData.append("id", id);
    formData.append("lang", lang);
    const url = `${APIURL}/cloudinary/upload_lang.php`

    // Envío la petición
    return this.httpClient.post( url, formData, { withCredentials: true })
  }
}
