import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game.component';
import { SharedModule } from '../../shared/shared.module';

import { AiService } from './services/ai/ai.service';

import * from './interfaces/game.interfaces';

@NgModule({
  declarations: [GameComponent, AiService],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
