import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ThisWayUpIconComponent } from './this-way-up-icon/this-way-up-icon.component';
import { ShakeBarComponent } from './shake-bar/shake-bar.component';

// for socket.io
const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ThisWayUpIconComponent,
    ShakeBarComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
