import { CloudinaryService } from './../../shared/services/backend/cloudinary.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput, IonCol, IonRow, IonAvatar, IonImg, IonChip, IonIcon, IonLoading, IonItem, IonLabel, IonTitle } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeCircle, closeCircleOutline, eye } from 'ionicons/icons';

import { emailPattern, passwordMatchValidator, passwordPattern } from 'src/app/shared/validators/register-login.validator';
import { TranslatorService } from 'src/app/shared/services/translator.service';
import { UserService } from 'src/app/shared/services/backend/user.service';
import { Response } from 'src/app/shared/Interfaces/response.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ IonTitle ,IonIcon, IonChip, IonImg, IonAvatar, IonRow, IonCol, IonButton, IonInput, CommonModule, FormsModule, TranslatePipe, ReactiveFormsModule, IonLoading, IonItem, IonLabel ]
})
export default class SignupPage{

  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private translatorService = inject(TranslatorService);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cloudinaryService = inject(CloudinaryService);

  public registerForm = signal<FormGroup>(this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(6)]], // Validación de correo
    email: ['', [Validators.required, Validators.pattern(emailPattern)]], // Validación de correo
    password: ['', [Validators.required, Validators.pattern(passwordPattern), Validators.minLength(6)]], // Validación de contraseña
    confirmPassword: ['', [Validators.required]], // Validación de contraseña
  }, { validators: passwordMatchValidator }));

  
  public userNameError = signal<string>("REGISTER.ERRORS.REQUIRED");
  public emailError = signal<string>("REGISTER.ERRORS.REQUIRED");
  public passError = signal<string>("REGISTER.ERRORS.REQUIRED");
  public confirmPassError = signal<string>("REGISTER.ERRORS.REQUIRED");

  public creationError = signal<string | null>(null);

 
  public profileImageUrl = signal<string>("");
  public profileImage = signal<File|null>(null);

  public passVisibility = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  constructor() {
    addIcons({eye,closeCircle,closeCircleOutline});
  }

  signUp(){
    if (this.registerForm().valid){
      this.isLoading.set(true);
      this.userService.createUser(this.registerForm().get("nombreUsuario")!.value, this.registerForm().get("email")!.value, this.registerForm().get("password")!.value)
        .subscribe( ( response: Response ) => {
          console.log("Usuario creado",response);
          if(response.exito){
            if(this.profileImage()) {
              this.cloudinaryService.uploadImg(this.profileImage()!, "user", response.userId!, "perfil")
                .subscribe((res:any) => {
                  console.log("Imagen subida: ", res);
                  this.toastService.presentToast(this.translate.instant("TOAST.REGISTER"), "bottom", "success");
                  this.router.navigate(['/login'])
                  this.isLoading.set(false);

                })
            } else {
              this.toastService.presentToast(this.translate.instant("TOAST.REGISTER"), "bottom", "success");
              this.router.navigate(['/login'])
              this.isLoading.set(false);
            }
          } else {
            if (response.error === "both") {
              this.creationError.set("REGISTER.ERRORS.BOTH")
            } else if (response.error === "email") {
              this.creationError.set("REGISTER.ERRORS.EMAIL")
            } else if (response.error === "userName") {
              this.creationError.set("REGISTER.ERRORS.USERNAME")
            }
            this.isLoading.set(false);
          }

        });
    }
  }

  /**
   * Método que permite seleccionar la imágen de perfíl
   */
  async openFilePicker(){
    const result = await FilePicker.pickImages({
      limit: 1,
      readData: true
    });

    if ( result.files.length > 0 ) {
      const file = result.files[0];
      this.profileImageUrl.set("data:image/;base64," + file.data!);
      this.profileImage.set(new File([file.blob!], file.name, { type: file.mimeType}));
    }
  }

  /**
   * Método para controlar el mensaje de error en el nombre de usuario
   */
  changeUserNameError() {
    const userNameControl = this.registerForm().get('nombreUsuario');
    if (userNameControl?.hasError("required")){
      this.userNameError.set("REGISTER.ERRORS.REQUIRED");
    } else if (userNameControl?.hasError("minlength")) {
      this.userNameError.set("REGISTER.ERRORS.USERNAME_MIN_LENGTH");
    }
  }

  /**
   * Método para controlar el mensaje de error en el email
   */
  changeEmailError() {
    const emailControl = this.registerForm().get('email');
    if (emailControl?.hasError("required")){
      this.emailError.set("REGISTER.ERRORS.REQUIRED");
    } else if (emailControl?.hasError("pattern")) {
      this.emailError.set("REGISTER.ERRORS.INVALID_EMAIL");
    }
  }

  /**
   * Método para controlar el mensaje de error en la contraseña
   */
  changePassError() {
    const passControl = this.registerForm().get('password');
    if (passControl?.hasError("required")){
      this.passError.set("REGISTER.ERRORS.REQUIRED");
    } else if (passControl?.hasError("minlength")) {
      this.passError.set("REGISTER.ERRORS.PASSWORD_MIN_LENGTH");
    } else if (passControl?.hasError("pattern")) {
      this.passError.set("REGISTER.ERRORS.INVALID_PASSWORD");
    }
  }

  /**
   * Método para controlar el mensaje de error en confirmar contraseña
   */
  changeConfirmPassError() {
    const passControl = this.registerForm().get('confirmPassword');
    if (passControl?.hasError("required")){
      this.confirmPassError.set("REGISTER.ERRORS.REQUIRED");
    } else if (passControl?.hasError("passwordMismatch")) {
      this.confirmPassError.set("REGISTER.ERRORS.PASSWORD_MISMATCH");
    }
  }

  /**
   * Permite eliminar la imagen ya seleccionada
   */
  delImage() {
    this.profileImage.set(null);
    this.profileImageUrl.set("");
  }

  /**
   * Método para mostrar la contraseña
   */
  tooglePassVisibility() {
    this.passVisibility.set(true);

    setTimeout( () => {
      this.passVisibility.set(false);
    }, 5000)
  }
}
