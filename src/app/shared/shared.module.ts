import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingErrorComponent } from './components/';
import { FormsModule } from '@angular/forms';
import { SnackbarComponent } from './components/';

@NgModule({
  declarations: [RoutingErrorComponent, SnackbarComponent],
  imports: [CommonModule, FormsModule],
  exports: [FormsModule, SnackbarComponent]
})
export class SharedModule {}
