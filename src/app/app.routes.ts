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
    path: 'nuevoHotel',
    loadComponent: () => import('./pages/nuevo-hotel/nuevo-hotel.page').then( m => m.NuevoHotelPage)
  },
  {
    path: 'maps',
    loadComponent: () => import('./pages/maps/maps.page').then( m => m.MapsPage)
  },
  {
    path: 'mapaHoteles',
    loadComponent: () => import('./pages/mapa-hoteles/mapa-hoteles.page').then( m => m.MapaHotelesPage)
  },
  {
    path: 'mapaHotel/:idHotel',
    loadComponent: () => import('./pages/mapa-hotel/mapa-hotel.page').then( m => m.MapaHotelPage)
  },
  {
    path: 'paginaHotel/:idHotel',
    loadComponent: () => import('./pages/pagina-hotel/pagina-hotel.page').then( m => m.PaginaHotelPage)
  }

    
];
