import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-shake-bar',
  templateUrl: './shake-bar.component.html',
  styleUrls: ['./shake-bar.component.css']
})
export class ShakeBarComponent implements OnInit {

  constructor(private socketService: SocketService) {}

  percent: Number = 90.0;

  ngOnInit(): void {
  }

  setPercent(perc: Number) {
    this.percent = perc;
  }

}
