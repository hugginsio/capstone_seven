import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../classes/gamecore/game.class.Player';

@Component({
  selector: 'app-player-shard',
  templateUrl: './player-shard.component.html',
  styleUrls: ['./player-shard.component.scss']
})
export class PlayerShardComponent implements OnInit, OnChanges {

  @Input() playerDetail: Player;
  @Input() tradingSubject: Subject<boolean>;
  // @Input() endingTurn: Subject<boolean>;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    console.log(this.playerDetail);
  }

  triggerTrading(): void {
    this.tradingSubject.next(true);
  }
}
