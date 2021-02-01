import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routing-error',
  templateUrl: './routing-error.component.html',
  styleUrls: ['./routing-error.component.scss']
})
export class RoutingErrorComponent implements OnInit {
  constructor(
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    console.error(`Routing error. Current path: ${this.router.url}`);
  }
}
