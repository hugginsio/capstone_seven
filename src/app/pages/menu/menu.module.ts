import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuLandingComponent } from './landing/menu-landing.component';
import { MenuOptionsComponent } from './options/menu-options.component';

@NgModule({
  declarations: [MenuLandingComponent, MenuOptionsComponent],
  imports: [BrowserModule, CommonModule, SharedModule, MenuRoutingModule]
})
export class MenuModule {}
