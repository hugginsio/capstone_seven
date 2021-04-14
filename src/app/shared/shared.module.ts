import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpSlideshowComponent, SnackbarComponent, RoutingErrorComponent, SoundControllerComponent } from './components/';
import { FormsModule } from '@angular/forms';
import { BoomboxDirective } from './directives/boombox/boombox.directive';

@NgModule({
  declarations: [RoutingErrorComponent, SnackbarComponent, HelpSlideshowComponent, SoundControllerComponent, BoomboxDirective],
  imports: [CommonModule, FormsModule],
  exports: [FormsModule, SnackbarComponent, HelpSlideshowComponent, SoundControllerComponent, BoomboxDirective]
})
export class SharedModule {}
