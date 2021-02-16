import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IntroTeamComponent } from './team/intro-team.component';
import { IntroGameComponent } from './game/intro-game.component';

const routes: Routes = [
  {
    path: 'intro/team',
    component: IntroTeamComponent
  },
  {
    path: 'intro/game',
    component: IntroGameComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class IntroRoutingModule {}
