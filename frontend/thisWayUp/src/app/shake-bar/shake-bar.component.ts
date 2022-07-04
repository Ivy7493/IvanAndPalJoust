import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shake-bar',
  templateUrl: './shake-bar.component.html',
  styleUrls: ['./shake-bar.component.css']
})
export class ShakeBarComponent implements OnInit {

  constructor(
  ) {}

  percent: number = 75.0;

  ngOnInit(): void {
    // setInterval(this.addPercent, 10);
  }

  addPercent() {
    this.percent++;
    this.percent %= 100;
  }

  setPercent(perc: number) {
    this.percent = perc;
  }

}
