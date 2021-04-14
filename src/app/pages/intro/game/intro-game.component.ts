import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-intro-game",
  templateUrl: "./intro-game.component.html",
  styleUrls: ["../intro-common.scss"],
})
export class IntroGameComponent implements OnInit, OnDestroy {
  private introInterval: NodeJS.Timeout;

  constructor(private readonly routerService: Router) {}

  ngOnInit(): void {
    this.introInterval = setTimeout(() => {
      this.routerService.navigate(["/menu/landing"]);
    }, 10000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.introInterval);
  }
}
