import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuLandingComponent } from './landing/menu-landing.component';
import { MenuOptionsComponent } from './options/menu-options.component';

const routes: Routes = [
  {
    path: 'menu/landing',
    component: MenuLandingComponent
  },
  {
    path: 'menu/options',
    component: MenuOptionsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuRoutingModule {}
