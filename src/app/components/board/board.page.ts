import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {

  ddData = [];
  constructor() {

  }

  ngOnInit() {

  }



  llenar() {
    for (let i = 0; i != 64; i++) {


      this.ddData.push(i);
    }

    console.log(this.ddData);

  }
}
