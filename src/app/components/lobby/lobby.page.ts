import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { GameCreaterService} from '../../services/game-creater.service'
import { ModalController } from '@ionic/angular'
import { PlayersPage } from './modalUser/players/players.page';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  constructor(private _gameService: GameCreaterService,
              private toast: ToastController,
              public modalController: ModalController,
              ) { }

  segmentModel = "settings";
  playerGames = [];
  selectedGame;
  selectedUser;

  
  ngOnInit() {
    this.getAllGames();
  }

  async presentModal(){
  const modal = await this.modalController.create({
    component: PlayersPage
  })
  modal.onDidDismiss().then( user => {
    var user_selected = user['data']['user']
    this.selectedUser = user_selected;
  })
  return await modal.present();

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

  onSegmentChange() {
    this.segmentModel = 'players';

  }

  onMultiplayerClick(){
    this.presentModal();
    
  }

  deleteSelectedUser(){
    this.selectedUser = undefined;
  }

  
  




}
