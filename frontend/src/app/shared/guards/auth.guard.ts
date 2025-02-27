import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { DataLocalService } from '../services/data-local.service';

export const authGuard: CanMatchFn = async (route) => {
  const dataLocal = inject(DataLocalService);
  // const login = userService.userInit();

  const login = await dataLocal.getValue("user");

  if (login) {
    if (route.path === "login" || route.path === "signup")
      return false;
    else
      return true;
  } else {
    if (route.path === "login" || route.path === "signup")
      return true;
    else
      return false;
  }

};
