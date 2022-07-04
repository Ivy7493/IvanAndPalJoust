import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-button',
  templateUrl: './join-button.component.html',
  styleUrls: ['./join-button.component.css']
})
export class JoinButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  joinGameClicked(event: Event) {
    // Fetch request to Identity/
    // fetch("/Identity/uniquePlayer").then(x => x.json()).then((x) => { document.writeln(x); });
  }
}
