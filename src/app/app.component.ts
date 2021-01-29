import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
  ) {
    console.log(`Production: ${AppConfig.production}`);
    console.log(`Environment: ${AppConfig.environment} / ${this.electronService.isElectron ? 'ELECTRON' : 'BROWSER'}`);
  }
}
