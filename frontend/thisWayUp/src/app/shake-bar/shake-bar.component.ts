import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shake-bar',
  templateUrl: './shake-bar.component.html',
  styleUrls: ['./shake-bar.component.css']
})
export class ShakeBarComponent implements OnInit {

  constructor(
  ) {}

  percent: Number = 90.0;

  ngOnInit(): void {
  }

  setPercent(perc: Number) {
    this.percent = perc;
  }

}
