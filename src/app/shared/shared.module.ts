import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpSlideshowComponent, SnackbarComponent, RoutingErrorComponent } from './components/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoutingErrorComponent, SnackbarComponent, HelpSlideshowComponent],
  imports: [CommonModule, FormsModule],
  exports: [FormsModule, SnackbarComponent, HelpSlideshowComponent]
})
export class SharedModule {}
