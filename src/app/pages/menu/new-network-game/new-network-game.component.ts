import { Component, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit {
  private username: string;

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService
  ) {}

  ngOnInit(): void {
    // instantiate class here
    // this.matchmaking = new MatchmakingService(this.username);
    // this.networking = new GameNetworkingService();
    this.matchmakingService.initialize(this.username);

    this.matchmakingService.listen('you-connected').subscribe(() => {
      console.log('You are connected to your UDP server.');
    });

    this.matchmakingService.listen('game-found').subscribe((gameInfo: any) => {
      const oppUsername = gameInfo.username;
      const oppAddress = gameInfo.oppAddress;

    //Add a <div> to show the game on screen
    });

    this.networkingService.listen('lobby-joined').subscribe((gameInfo:any) => {
      const board = gameInfo.gameboard;
      const isHostP1 = gameInfo.isHostPlayer1;
      
      //Create network game using these settings
    });

    this.networkingService.listen('lobby-full').subscribe(() => {
      console.log('Lobby is full. Sucks bro');
    });
  }

  HostGame(): void {
    //1. Lead to normal game creation screen
    //2. Create network game

    //3. Create game server
    const board = '';
    const isPlayer1 = true;
    this.networkingService.createTCPServer(board, isPlayer1);

    //4. Broadcast the game until someone joins
    this.matchmakingService.broadcastGame(); //Every 1000ms or so
  }

  JoinGame(): void {
    //get gameInfo from object clicked
    
    //this.networking.connectTCPserver(oppAddress)

    //GoTo: lobby-joined/full
  }

}
