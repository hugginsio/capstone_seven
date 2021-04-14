import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";

import { IntroModule } from "./pages/intro/intro.module";
import { GameModule } from "./pages/game/game.module";
import { MenuModule } from "./pages/menu/menu.module";

import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CoreModule,
    FormsModule,
    GameModule,
    HttpClientModule,
    IntroModule,
    MenuModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
