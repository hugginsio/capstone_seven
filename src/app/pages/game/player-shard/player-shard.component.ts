import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../classes/gamecore/game.class.Player';
import { CommPackage } from '../interfaces/game.interface';
import { CommCode } from '../interfaces/game.enum';

@Component({
  selector: 'app-player-shard',
  templateUrl: './player-shard.component.html',
  styleUrls: ['./player-shard.component.scss']
})
export class PlayerShardComponent implements OnInit, OnChanges {

  @Input() playerDetail: Player;
  @Input() playerName: string;
  @Input() actionSubject: Subject<CommPackage>;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    console.log(this.playerDetail);
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
    // this.actionSubject.next(this.generateMessage(CommCode.END_TURN));
  }
}
