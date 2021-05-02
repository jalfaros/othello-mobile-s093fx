import { Component, OnInit } from '@angular/core';
import { GameCreaterService } from 'src/app/services/game-creater.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  constructor(private _gameService: GameCreaterService,
              public viewCtrl: ModalController) { }

  registeredUsers = []


  ngOnInit() {
    this.fetchAllPlayers();
  }

  fetchAllPlayers() {
    this._gameService.getAllPlayers().subscribe(users => {
      this.registeredUsers = users;
      console.log(this.registeredUsers)
    });
  }


  dimiss(){
    this.viewCtrl.dismiss();
  }

  onSelectedPlayer( user ){
    console.log(user)
    this.viewCtrl.dismiss({
      user
    })
  }

}
