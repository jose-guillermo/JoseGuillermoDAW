import { effect, inject, Injectable, signal  } from '@angular/core';
import { DataLocalService } from './data-local.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  /**
   * El tema actual de la aplicación
   */
  public currentTheme = signal<string>("");

  private dataLocal = inject(DataLocalService);

  constructor(){
    this.initTheme();
    // Aplica un efecto cada vez que el signal currentTheme cambia
    effect(() => {
      let bodyClass = document.body.classList;
      bodyClass.remove('theme-dark', 'theme-light');
      if ( this.currentTheme() ){
        bodyClass.add( this.currentTheme() );
      } else {
        bodyClass.add( "theme-light" )
      }
    })
  }

  /**
   * Inicializa el tema de la aplicación
   */
  private async initTheme () {
    const theme =  await this.dataLocal.getValue( "theme" );
    this.currentTheme.set(theme);
  }

  /**
   * Cambia el tema de la aplicación
   */
  public changeTheme ( ) {
    this.currentTheme.set( this.currentTheme() === "theme-dark" ? "theme-light" : "theme-dark");
    this.dataLocal.setValue("theme", this.currentTheme());
  }
}
