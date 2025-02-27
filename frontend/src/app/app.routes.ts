import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { userGuard } from './shared/guards/user.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { gameGuard } from './shared/guards/game.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout.page'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page')
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy/privacy.page')
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page'),
        canMatch: [authGuard]
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.page'),
        canMatch: [authGuard]
      },
      {
        path: 'shop',
        loadComponent: () => import('./pages/shop/shop.page'),
        canMatch: [authGuard]
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages.page'),
        canMatch: [authGuard]
      },

      {
        path: 'feedback',
        loadComponent: () => import('./pages/feedback/feedback.page'),
        canMatch: [authGuard, userGuard]
      },
      {
        path: 'add-product',
        loadComponent: () => import('./pages/add-product/add-product.page'),
        canMatch: [authGuard, adminGuard]
      },
      {
        path: 'add-achievement',
        loadComponent: () => import('./pages/add-achievement/add-achievement.page'),
        canMatch: [authGuard, adminGuard]
      },
      {
        path: 'add-game',
        loadComponent: () => import('./pages/add-game/add-game.page')
      },
       
      {
        path: '',
        redirectTo: "home",
        pathMatch: "full"
      },
    ]
  },
  {
    path: 'game-layout/:id/:idOponent',
    loadComponent: () => import('./games/game-layout/game-layout.page'),
    canMatch: [gameGuard]
  },   

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },




];
