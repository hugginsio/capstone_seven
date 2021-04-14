import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { MenuLandingComponent } from "./landing/menu-landing.component";
import { NewLocalGameComponent } from "./new-local-game/new-local-game.component";
import { NewNetworkGameComponent } from "./new-network-game/new-network-game.component";
import { MenuHelpComponent } from "./help/menu-help.component";
import { MenuOptionsComponent } from "./options/menu-options.component";
import { NewNetworkGameHostComponent } from "./new-network-game-host/new-network-game-host.component";

const routes: Routes = [
  {
    path: "menu/landing",
    component: MenuLandingComponent,
  },
  {
    path: "menu/new/local",
    component: NewLocalGameComponent,
  },
  {
    path: "menu/new/online",
    component: NewNetworkGameComponent,
  },
  {
    path: "menu/new/online/host",
    component: NewNetworkGameHostComponent,
  },
  {
    path: "menu/help",
    component: MenuHelpComponent,
  },
  {
    path: "menu/options",
    component: MenuOptionsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
