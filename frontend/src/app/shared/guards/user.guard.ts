import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { DataLocalService } from '../services/data-local.service';
import { User } from '../Interfaces/response.interface';

export const userGuard: CanMatchFn = async () => {
  const dataLocal = inject(DataLocalService);
  // const login = userService.userInit();

  const user: User = await dataLocal.getValue("user");

  const rol = user.rol;
  if(rol === "admin") {
    return false;
  }
  return true;
};
