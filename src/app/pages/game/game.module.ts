import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game.component';
import { PlayerShardComponent } from './player-shard/player-shard.component';


@NgModule({
  declarations: [GameComponent, PlayerShardComponent],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
