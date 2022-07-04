import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-ready-text',
  templateUrl: './game-ready-text.component.html',
  styleUrls: ['./game-ready-text.component.css']
})
export class GameReadyTextComponent implements OnInit {

  constructor() { }

  gameStateMessage: string = "Game ready!";
  numPlayersWaiting: number = 3;

  ngOnInit(): void {
  }

}
