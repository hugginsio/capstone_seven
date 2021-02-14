import { Component, OnInit } from '@angular/core';
import { Networking } from '../../networking/networkingStart';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // instantiate class here
    const net = new Networking();
    net.initialize();
  }

}
