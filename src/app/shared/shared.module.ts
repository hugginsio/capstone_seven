import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingErrorComponent } from './components/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoutingErrorComponent],
  imports: [CommonModule, FormsModule],
  exports: [FormsModule]
})
export class SharedModule {}
