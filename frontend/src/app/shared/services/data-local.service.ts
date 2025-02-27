import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class DataLocalService {

  private _storage: Storage | null = null;

  private storage: Storage = inject(Storage);

  constructor() {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
  }

  /**
   * Actualiza un campo en el almacenamiento local, si no existe lo crea
   * @param key El nombre del campo dentro del almacenamiento local
   * @param value El valor que se almacenará en el campo en el almacenamiento local
   */
  public async setValue( key: string, value: any): Promise<void> {
    if (this._storage)
      await this._storage.set(key, value);
  }

  /**
   * Consigue el valor del campo que está guardado en el almacenamiento local
   * @param key El nombre del campo dentro del almacenamiento local
   * @returns Devuelve una promesa con el valor de la key del almacenamiento local
   */
  public async getValue( key: string ): Promise<any> {
    let value: any;

    if (!this._storage) {
      await this.init();
    }

    value = await this._storage!.get( key );

    return value;
  }

  public async deleteKey( key: string ): Promise<void> {
    if (this._storage)
      await this._storage.remove(key);
  }
}
