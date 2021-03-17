import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { NetworkGameInfo } from './interfaces/new-network-game.interface';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit, AfterViewInit {
  private username: string;
  private list:any;
  private gamesList: Array<NetworkGameInfo>;
  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService
  ) {}

  ngAfterViewInit(): void {
    this.list = document.getElementById("gameList");
  }

  ngOnInit(): void {
    // instantiate class here
    this.matchmakingService.initialize(this.username);

    this.matchmakingService.listen('you-connected').subscribe(() => {
      console.log('You are connected to your UDP server.');
    });

    this.matchmakingService.listen('game-found').subscribe((gameInfo: any) => {
      const oppUsername:string = gameInfo.username;
      const oppAddress:string = gameInfo.oppAddress;
      console.log(`${oppUsername} wants to play at ${oppAddress}`);
      //append to arrary
      this.gamesList.push({
        host: oppUsername,
        address: oppAddress
      });

      //Add a <div> to show the game on screen
      // const messageElement = document.createElement('div');
      // messageElement.innerText = `${oppUsername} wants to play at ${oppAddress}`;
      // this.list.append(messageElement);
    });
  }

  HostGame(): void {
    //1. Lead to normal game creation screen
    //2. Create network game

    //3. Create game server
    const board = '';
    const isPlayer1 = true;
    this.networkingService.createTCPServer(board, isPlayer1);
    this.initializeListeners();

    //4. Broadcast the game until someone joins
    this.matchmakingService.broadcastGame(); //Every 1000ms or so
  }

  JoinGame(): void {
    //get gameInfo from object clicked
    const oppAddress = "";
    this.networkingService.connectTCPserver(oppAddress);

    this.initializeListeners();
  }

  initializeListeners(): void {
    this.networkingService.listen('lobby-joined').subscribe((gameInfo:any) => {
      const board = gameInfo.gameboard;
      const isHostP1 = gameInfo.isHostPlayer1;
      
      //Create network game using these settings
    });

    this.networkingService.listen('lobby-full').subscribe(() => {
      console.log('Lobby is full. Sucks bro');
    });
  }

}
