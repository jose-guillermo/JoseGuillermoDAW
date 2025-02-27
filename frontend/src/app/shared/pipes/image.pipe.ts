import { inject, Pipe, PipeTransform } from '@angular/core';

import { environment } from 'src/environments/environment';
import { UserService } from '../services/backend/user.service';

const CLOUDURL = environment.clodinaryUrl;

@Pipe({
  name: 'image',
  standalone: true
})
export class ImagePipe implements PipeTransform {

  private userService = inject(UserService);

  transform(dir: string, type: string, id: string = this.userService.user()!.id): string {
    const url = `${CLOUDURL}/${dir}/${id}/${type}.webp`;    
    return url;

  }

}
