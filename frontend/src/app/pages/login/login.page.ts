import { MessagesService } from 'src/app/shared/services/backend/messages.service';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCardContent, IonCardHeader, IonText, IonCardTitle, IonCard, IonInput, IonIcon, IonLoading, IonLabel, IonItem } from '@ionic/angular/standalone';
import { eye, lockClosed, code, logoIonic, logoAngular } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { emailPattern } from 'src/app/shared/validators/register-login.validator';
import { TranslatorService } from 'src/app/shared/services/translator.service';
import { UserService } from 'src/app/shared/services/backend/user.service';
import { Response } from 'src/app/shared/Interfaces/response.interface';
import { DataLocalService } from '../../shared/services/data-local.service';
import { RealtimeDatabaseService } from 'src/app/shared/services/realtime-database.service';
import { GamesService } from 'src/app/shared/services/backend/game.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonCard, IonCardTitle, IonCardHeader, IonIcon, IonCardContent, IonButton, CommonModule, ReactiveFormsModule, IonInput, TranslatePipe, RouterModule, IonLoading, IonLabel, IonItem ]
})
export default class LoginPage {
  @ViewChild('.item-inner', { static: false }) dynamicElement: any = null;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dataLocal = inject(DataLocalService);
  private router = inject(Router);
  private realtimeDb = inject(RealtimeDatabaseService);
  private messagesService = inject(MessagesService);
  private gamesService = inject(GamesService);

  public loginForm = signal<FormGroup>(this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]], // Validación de correo
    password: ['', [Validators.required, Validators.minLength(6)]], // Validación de contraseña
  }));

  public passVisibility = signal<boolean>(false);
  public emailError = signal<string>("LOGIN.ERROR.EMPTY_FIELD");
  public passError = signal<string>("LOGIN.ERROR.EMPTY_FIELD");

  public showErrorMessage = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  constructor() {
    addIcons({code,logoIonic,logoAngular,eye,lockClosed});
  }

  /**
   * Método para manejar el envío del formulario
   */
  async login() {
    if (this.loginForm().valid) {
      this.isLoading.set(true);
      this.userService.login(this.loginForm().get("email")?.value, this.loginForm().get("password")?.value)
        .subscribe( async ( response: Response ) => {
          console.log(response);
          if( response.exito ){
            this.userService.getUser()
              .subscribe((res: Response) => {
                this.dataLocal.setValue("user", res.user).then(() => {
                  this.isLoading.set(false);

                  this.userService.userInit();
                  this.router.navigate(["/home"]);
                  this.realtimeDb.connection(res.user!.id);
                })
              });
            this.messagesService.getMessages()
              .subscribe(( res: Response ) => {
                this.dataLocal.setValue("messages", res.mensajes).then(() => {
                  this.messagesService.messagesInit();
                })
              })
            this.gamesService.getGames()
              .subscribe((res: Response) => {
                this.dataLocal.setValue("games", res.juegos).then(() => {
                  this.gamesService.gamesInit();
                })
              })
            
          } else {
            this.isLoading.set(false);
            this.showErrorMessage.set(true);
            console.log(response);
          }
        })
      
    }
  }

  /**
   * Método para controlar el mensaje de error en el email
   */
  changeEmailError() {
    const emailControl = this.loginForm().get('email');

    if (emailControl?.hasError("required")){
      this.emailError.set("LOGIN.ERROR.EMPTY_FIELD");
    } else if (emailControl?.hasError("pattern")) {
      this.emailError.set("LOGIN.ERROR.INVALID_EMAIL");
    }
  }

  /**
   * Método para controlar el mensaje de error en la contraseña
   */
  changePassError() {
    const passControl = this.loginForm().get('password');
    if (passControl?.hasError("required")){
      this.passError.set("LOGIN.ERROR.EMPTY_FIELD");
    } else if (passControl?.hasError("minlength")) {
      this.passError.set("LOGIN.ERROR.INVALID_PASSWORD");
    }
  }

  /**
   * Método para mostrar la contraseña
   */
  tooglePassVisibility() {
    this.passVisibility.set(true);

    setTimeout( () => {
      this.passVisibility.set(false);
    }, 3000)
  }
}
