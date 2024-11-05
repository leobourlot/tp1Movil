import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'registroHotel',
    loadComponent: () => import('./pages/registro-hotel/registro-hotel.page').then( m => m.RegistroHotelPage)
  },
  {
    path: 'nuevo-hotel',
    loadComponent: () => import('./pages/nuevo-hotel/nuevo-hotel.page').then( m => m.NuevoHotelPage)
  },
  
];
