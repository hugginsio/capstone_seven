import { Component, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit {

  private matchmaking:MatchmakingService;
  private networking:GameNetworkingService;
  private username:string;

  constructor() { }

  ngOnInit(): void {
    // instantiate class here
    this.matchmaking = new MatchmakingService(this.username);
    this.networking = new GameNetworkingService();

    this.matchmaking.listen('you-connected').subscribe(() => {
      console.log('You are connected to your UDP server.');
    })

    this.matchmaking.listen('game-found').subscribe((gameInfo: any) => {
      let oppUsername:string = gameInfo.username;
      let oppAddress:string = gameInfo.oppAddress;

      //Add a <div> to show the game on screen
    })

    this.networking.listen('lobby-joined').subscribe((gameInfo:any) => {
      let board:string = gameInfo.gameboard;
      let isHostP1:boolean = gameInfo.isHostPlayer1;
      
      //Create network game using these settings
    })

    this.networking.listen('lobby-full').subscribe(() => {
      console.log('Lobby is full. Sucks bro');
    })
  }

  HostGame()
  {
    //1. Lead to normal game creation screen
    //2. Create network game

    //3. Create game server
    let board:string = '';
    let isPlayer1:boolean = true;
    this.networking.createTCPServer(board, isPlayer1);

    //4. Broadcast the game until someone joins
    this.matchmaking.broadcastGame(); //Every 1000ms or so
  }

  JoinGame()
  {
    //get gameInfo from object clicked
    
    //this.networking.connectTCPserver(oppAddress)

    //GoTo: lobby-joined/full
  }

}
