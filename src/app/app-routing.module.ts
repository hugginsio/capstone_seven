import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameRoutingModule } from "./pages/game/game-routing.module";
import { IntroRoutingModule } from "./pages/intro/intro-routing.module";
import { MenuRoutingModule } from "./pages/menu/menu-routing.module";
import { RoutingErrorComponent } from "./shared/components";

const routes: Routes = [
  {
    path: "",
    redirectTo: "intro/team",
    pathMatch: "full",
  },
  {
    path: "**",
    component: RoutingErrorComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
    IntroRoutingModule,
    MenuRoutingModule,
    GameRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
