import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro-game',
  templateUrl: './intro-game.component.html',
  styleUrls: ['./intro-game.component.scss']
})
export class IntroGameComponent implements OnInit {

  constructor(
    private readonly routerService: Router
  ) { }

  ngOnInit(): void {
    console.log('Navigating in 15s');
    setTimeout(() => {
      this.routerService.navigate(['/menu/landing']);
    }, 15000);
  }

}
