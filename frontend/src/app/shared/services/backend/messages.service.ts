import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Message, Response } from '../../Interfaces/response.interface';
import { DataLocalService } from '../data-local.service';
import { ToastService } from '../toast.service';
import { TranslateService } from '@ngx-translate/core';

const URL = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private http = inject(HttpClient);
  private dataLocal = inject(DataLocalService);
  private toastSevice = inject(ToastService);
  private translate = inject(TranslateService);

  public messages = signal<Message[] | null>(null);

  constructor() {
    effect(() => {
      this.dataLocal.setValue("messages", this.messages());
    });
    this.messagesInit();
    
    this.getMessages()
      .subscribe((res: Response) => {
        if(res.exito) {
          this.messages.set(res.mensajes!);
        }
      })
  }

  sendMessage(recipient: string, title: string, body: string, type: string): Observable<Response> {
    const formData = new FormData();
    formData.append('destinatario', recipient);
    formData.append('titulo', title);
    formData.append('contenido', body);
    formData.append('tipo', type);

    const url = `${ URL }/db/message/send.php`

    return this.http.post<Response>(url, formData, { withCredentials: true });
  }

  messagesInit(){
    this.dataLocal.getValue("messages").then((messages: Message[]) => {
      if(messages)
        this.messages.set(messages);
      });
  }

  getMessages():Observable<Response> {
    const url = `${ URL }/db/message/messages.php`
    return this.http.get<Response>(url, { withCredentials: true })
  }

  deleteMessage(idMessage: string) {
    const formData = new FormData();
    formData.append('idMessage', idMessage);

    const url = `${ URL }/db/message/delete.php`
    
    this.http.post<Response>(url, formData, { withCredentials: true })
      .subscribe(( res: Response ) => {
        if(res.exito == true){
          this.toastSevice.presentToast(this.translate.instant("TOAST.DELETE_MESSAGE"), "bottom", "danger")
          this.messages.set( [ ...res.mensajes! ] )
        }else if(res.error == "No hay mensajes")
          this.messages.set( null )
      })
  }

  markReadMessage(idMessage: string) {
    const formData = new FormData();
    formData.append('idMessage', idMessage);

    const url = `${ URL }/db/message/markAsRead.php`
    this.http.post<Response>(url, formData, { withCredentials: true })
      .subscribe((res: any) => {
        if (res.exito){
          this.messages.update((messages) => 
            messages!.map(msg => 
              msg.id === idMessage ? { ...msg, read: true } : msg
            )
          )
        }
      })
  }
}
