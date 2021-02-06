import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuLandingComponent } from './landing/menu-landing.component';

const routes: Routes = [
  {
    path: 'menu/landing',
    component: MenuLandingComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuRoutingModule {}
