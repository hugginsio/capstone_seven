import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { IntroRoutingModule } from './intro-routing.module';
import { IntroTeamComponent } from './team/intro-team.component';
import { IntroGameComponent } from './game/intro-game.component';

@NgModule({
  declarations: [IntroTeamComponent, IntroGameComponent],
  imports: [CommonModule, SharedModule, IntroRoutingModule]
})
export class IntroModule {}
