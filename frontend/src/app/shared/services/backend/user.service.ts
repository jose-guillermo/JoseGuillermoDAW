import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Response, User } from '../../Interfaces/response.interface';
import { DataLocalService } from '../data-local.service';
import { RealtimeDatabaseService } from '../realtime-database.service';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private dataLocal = inject(DataLocalService);
  private realtimeDatabase = inject(RealtimeDatabaseService);

  public user = signal<User | null>( null );

  constructor() {
    effect(() => {
      this.dataLocal.setValue("user", this.user());
    });
    this.userInit();
    this.getUser()
      .subscribe((res: Response) => {
        if(res.exito) {
          this.user.set(res.user!);
          this.realtimeDatabase.connection(this.user()!.id);

        }
      })
  }

  createUser(userName: string, email: string, password: string): Observable<Response>{
    const formData = new FormData();
    formData.append('nombre_usuario', userName);
    formData.append('email', email);
    formData.append('password', password);

    const url = `${ URL }/db/user/create.php`

    return this.http.post<Response>(url, formData, { withCredentials: true });
  }

  login (email: string, password: string): Observable<Response>{
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const url = `${ URL }/db/user/login.php`
    // const url = `${ URL }/session/createSession.php`

    return this.http.post<Response>(url, formData, { withCredentials: true });
  }

  logout(): Observable<Response> {
    this.realtimeDatabase.writeData(`users/${ this.user()?.id}`, null)
    this.user.set(null);
    this.dataLocal.deleteKey("user");
    this.dataLocal.deleteKey("achievement");
    this.dataLocal.deleteKey("products");
    this.router.navigate(['home']);
    return this.http.get<Response>(`${URL}/session/destroySession.php`, { withCredentials: true });
  }

  userInit() {
    this.dataLocal.getValue("user").then((user: User) => {
      if(user)
        this.user.set(user);
    });
  }

  getUser():Observable<Response> {
    const url = `${ URL }/db/user/user.php`

    return this.http.get<Response>( url, { withCredentials: true } )
  }

}
