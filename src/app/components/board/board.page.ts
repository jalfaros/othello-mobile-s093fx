import { Component, OnInit } from '@angular/core';
import { GameCreaterService } from 'src/app/services/game-creater.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})

export class BoardPage implements OnInit {

  //0nj7MiRbsjeib3eQIrJA

  gameBoard = []; //Se guarda el tablero

  ddData = [];


  player1 = {
    playerId: '',
    playerName: '',
    score: 0
  };
  scorePlayer1 = 0;

  player2 = {
    playerId: '',
    playerName: '',
    score: 0
  };
  scorePlayer2 = 0;

  turnPlayer = '';
  color = '';
  constructor(private _service: GameCreaterService) {

  }

  ngOnInit() {

    this._service.getInitialGame('0nj7MiRbsjeib3eQIrJA').subscribe(({ game }: any) => {
      this.gameBoard = game.boardGame;

      this.player1 = game.player1;
      this.player2 = game.player2;

      this.scorePlayer1 = game.score.player1;
      this.scorePlayer2 = game.score.player2;

      (game.currentPlayer === this.player1.playerId) ? (this.turnPlayer = this.player1.playerName, this.color = 'White') : (this.turnPlayer = this.player2.playerName, this.color = 'Black')
      console.log(game.currentPlayer);

    })
  }


}
