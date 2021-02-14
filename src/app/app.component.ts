import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { LocalStorageService } from './shared/services/local-storage/local-storage.service';
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
    private storageService: LocalStorageService
  ) {
    this.production = AppConfig.production;
    
    console.log(`Production: ${this.production.toString()}`);
    console.log(`Environment: ${AppConfig.environment} / ${this.electronService.isElectron ? 'ELECTRON' : 'BROWSER'}`);

    // Game defaults
    // We set these in the app component so that they are always created on startup
    this.storageService.setContext('game');
    this.storageService.store('mode', 'pva');
    this.storageService.store('ai-difficulty', 'easy');
    this.storageService.store('guided-tutorial', 'false');
    this.storageService.update('board-seed', 'random');
  }
}
