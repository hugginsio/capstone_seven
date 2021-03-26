import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../classes/gamecore/game.class.Player';
import { CommPackage } from '../interfaces/game.interface';
import { CommCode } from '../interfaces/game.enum';
import { PlayerType } from '../enums/game.enums';

@Component({
  selector: 'app-player-shard',
  templateUrl: './player-shard.component.html',
  styleUrls: ['./player-shard.component.scss']
})
export class PlayerShardComponent implements OnInit {

  @Input() playerDetail: Player;
  @Input() playerName: string;
  @Input() currentPlayer: boolean;
  @Input() actionSubject: Subject<CommPackage>;

  constructor() { }

  ngOnInit(): void { }

  getDynamicClass(): string {
    return `${this.currentPlayer ? 'button-std' : 'button-disabled'} ${this.playerDetail?.type !== PlayerType.HUMAN ? 'button-hidden' : ''}`;
  }

  generateMessage(action: CommCode): CommPackage {
    return {
      code: action,
      player: this.playerDetail 
    };
  }

  triggerTrading(): void {
    this.actionSubject.next(this.generateMessage(CommCode.IS_TRADING));
  }

  triggerEndTurn(): void {
    this.actionSubject.next(this.generateMessage(CommCode.END_TURN));
  }

  triggerUndo(): void {
    this.actionSubject.next(this.generateMessage(CommCode.UNDO));
  }
}
