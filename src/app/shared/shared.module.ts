import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpSlideshowComponent, SnackbarComponent, RoutingErrorComponent, SoundControllerComponent } from './components/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoutingErrorComponent, SnackbarComponent, HelpSlideshowComponent, SoundControllerComponent],
  imports: [CommonModule, FormsModule],
  exports: [FormsModule, SnackbarComponent, HelpSlideshowComponent, SoundControllerComponent]
})
export class SharedModule {}
