import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro-game',
  templateUrl: './intro-game.component.html',
  styleUrls: ['./intro-game.component.scss']
})
export class IntroGameComponent implements OnInit, OnDestroy {
  private introInterval: NodeJS.Timeout;

  constructor(
    private readonly routerService: Router
  ) { }

  ngOnInit(): void {
    console.log('Navigating in 15s');
    this.introInterval = setTimeout(() => {
      this.routerService.navigate(['/menu/landing']);
    }, 15000);
  }

  ngOnDestroy(): void {
    console.log('Clearing game intro timer.');
    clearTimeout(this.introInterval);
  }
}
