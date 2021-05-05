import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { GameCreaterService } from 'src/app/services/game-creater.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {

  subscrition: Subscription;
  intervalId: number;

  gameBoard = []; //Se guarda el tablero

  ddData = [];

  state: any; //Se guarda todo el juego

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

  idGame;

  idUser: any = JSON.parse(localStorage.getItem('user'));

  endedGame = false;

  constructor(
    private _service: GameCreaterService,
    private toast: ToastController,) {
  }

  ngOnInit() {

    const source = interval(3000);
    this.subscrition = source.subscribe(v => this.getGame());

    this.getGame();
  }

  async informationToast(message, toastType) {
    const toast = await this.toast.create({
      message: message,
      color: toastType,
      animated: true,
      duration: 3000,
    });
    toast.present();
  }


  async getGame() {

    this.idGame = await localStorage.getItem('idGame');

    this._service.getInitialGame((this.idGame)).subscribe(({ game }: any) => {
      this.state = game;

      this.endedGame = game.endedGame;

      if (game.currentPlayer === this.idUser.uid) {
        this.informationToast('Is your turn!', 'success');
      }

      this.gameBoard = game.boardGame;

      this.player1 = game.player1;
      this.player2 = game.player2;

      this.scorePlayer1 = game.score.player1;
      this.scorePlayer2 = game.score.player2;

      (game.currentPlayer === this.player1.playerId) ? (this.turnPlayer = this.player1.playerName, this.color = 'White') : (this.turnPlayer = this.player2.playerName, this.color = 'Black')

    })
  }


  handleClick(id, item) {

    if (this.idUser.uid !== this.state.currentPlayer) {
      this.informationToast('wait your turn!', 'danger');
      return;
    }


    if (item) {
      this.informationToast('You can not play in this position!', 'danger');

      return;

    } else if (this.state.currentPlayer === this.idUser.uid) {

      var nextPlayer = '';

      this.idUser.uid === this.state.player2.playerId ? nextPlayer = this.state.player1.playerId : nextPlayer = this.state.player2.playerId;

      try {
        this._service.postClickGame({ idGame: this.idGame, boardGame: this.state.boardGame, xPlay: this.state.xPlay, clickedPosition: id, currentPlayer: nextPlayer })
          .subscribe();

      } catch (error) {
        this.informationToast('You can not play in this position!', 'danger');
      }

    }
  }

  skipTurn() {
    if (this.idUser.uid !== this.state.currentPlayer) {
      this.informationToast('wait your turn!', 'danger');
      return;
    }
    var nextPlayer = '';

    this.state.currentPlayer === this.state.player2.playerId ? nextPlayer = this.state.player1.playerId : nextPlayer = this.state.player2.playerId;

    this._service.editSkipTurn({ idGame: this.idGame, xPlay: !this.state.xPlay, currentPlayer: nextPlayer }).subscribe(res => {
      if (res['success']) {
        this.informationToast('Turn skiped!', 'success');
      }
    });
  }





}
