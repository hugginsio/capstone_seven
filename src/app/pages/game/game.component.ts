import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatchmakingService } from '../../matchmaking.service';
import { GameNetworkingService } from '../../game-networking.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('gameList') list:any;
  @ViewChild('oppAddress') input:any;

  private username = "Client McGee";

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService,
    private renderer: Renderer2
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
      const oppUsername:string = gameInfo.username;
      const oppAddress:string = gameInfo.oppAddress;

      //Add a <div> to show the game on screen
      const messageElement = document.createElement('div');
      messageElement.innerText = `${oppUsername} wants to play at ${oppAddress}`;
      //messageElement.click = this.JoinGame;
      this.renderer.appendChild(this.list, messageElement);
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
    const oppAddress = this.input.value;

    this.networkingService.connectTCPserver(oppAddress);
    this.initializeListeners();

    //GoTo: lobby-joined/full
  }

  private initializeListeners()
  {
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
