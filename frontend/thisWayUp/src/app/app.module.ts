import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ThisWayUpIconComponent } from './this-way-up-icon/this-way-up-icon.component';
import { ShakeBarComponent } from './shake-bar/shake-bar.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { JoinButtonComponent } from './join-button/join-button.component';
import { GameReadyTextComponent } from './game-ready-text/game-ready-text.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ThisWayUpIconComponent,
    ShakeBarComponent,
    PlayerListComponent,
    JoinButtonComponent,
    GameReadyTextComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
