import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";

import { MenuRoutingModule } from "./menu-routing.module";
import { MenuLandingComponent } from "./landing/menu-landing.component";
import { NewLocalGameComponent } from "./new-local-game/new-local-game.component";
import { NewNetworkGameComponent } from "./new-network-game/new-network-game.component";
import { NewNetworkGameHostComponent } from "./new-network-game-host/new-network-game-host.component";
import { MenuOptionsComponent } from "./options/menu-options.component";
import { MenuHelpComponent } from "./help/menu-help.component";

@NgModule({
  declarations: [
    MenuLandingComponent,
    NewLocalGameComponent,
    NewNetworkGameComponent,
    NewNetworkGameHostComponent,
    MenuOptionsComponent,
    MenuHelpComponent,
  ],
  imports: [BrowserModule, CommonModule, SharedModule, MenuRoutingModule],
})
export class MenuModule {}
