import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GameCreaterService} from '../../services/game-creater.service'

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  constructor(private _gameService: GameCreaterService,
              private toast: ToastController) { }

  segmentModel = "settings";
  playerGames = [];
  selectedGame;

  ngOnInit() {
    this.getAllGames();
  }

  async informationToast(message, toastType) {
    const toast = await this.toast.create({
      message: message,
      color: toastType,
      animated: true,
      duration: 2000,
    });
    toast.present();
  }

  onCreateGame() {
    this._gameService.createGame().subscribe(res => {

      if( !res['idGame'] ){
        this.informationToast('Something went wrong creating the game!','danger');
        return;
      }
      this.informationToast('Game created succesfully','success')
      this.playerGames.push( res['idGame'] );

    });
  }

  getAllGames() {
    this._gameService.getPlayerGames().subscribe(response => {
      this.playerGames = response;
    });
  }

  onSegmentChange($event) {
    this.segmentModel = 'players'
  }




}
