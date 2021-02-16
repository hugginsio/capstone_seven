import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { AppConfig } from '../environments/environment';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  public production: boolean;
  public reloadButton = true;

  constructor(
    private electronService: ElectronService,
  ) {
    this.production = AppConfig.production;
    
    console.log(`Production: ${this.production.toString()}`);
    console.log(`Environment: ${AppConfig.environment} / ${this.electronService.isElectron ? 'ELECTRON' : 'BROWSER'}`);
  }
}
