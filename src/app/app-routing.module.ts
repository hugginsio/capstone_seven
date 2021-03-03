import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingErrorComponent } from './shared/components';

import { LandingRoutingModule } from './pages/landing/landing-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: RoutingErrorComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    LandingRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
