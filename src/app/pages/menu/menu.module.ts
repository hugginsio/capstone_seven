import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuLandingComponent } from './landing/menu-landing.component';

@NgModule({
  declarations: [MenuLandingComponent],
  imports: [CommonModule, SharedModule, MenuRoutingModule]
})
export class MenuModule {}
