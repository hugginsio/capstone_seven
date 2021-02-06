import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro-team',
  templateUrl: './intro-team.component.html',
  styleUrls: ['./intro-team.component.scss']
})
export class IntroTeamComponent implements OnInit {

  constructor(
    private readonly routerService: Router
  ) { }

  ngOnInit(): void {
    console.log('Navigating in 3s');
    setTimeout(() => {
      this.routerService.navigate(['/intro/game']);
    }, 3000);
  }
}
