import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'formulario-libro',
    loadChildren: () => import('./formulario-libro/formulario-libro.module').then( m => m.FormularioLibroPageModule)
  },
  {
    path: 'menu-libro',
    loadChildren: () => import('./menu-libro/menu-libro.module').then( m => m.MenuLibroPageModule)
  },
  {
    path: 'visor-de-escenas',
    loadChildren: () => import('./visor-de-escenas/visor-de-escenas.module').then( m => m.VisorDeEscenasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
