import { Component, OnInit } from '@angular/core';
import { GameCreaterService } from 'src/app/services/game-creater.service';
import { ModalController } from '@ionic/angular';
import { element } from 'protractor';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  constructor(private _gameService: GameCreaterService,
    public viewCtrl: ModalController) { }

  registeredUsers = []
  roomPlayers: any[] = []
  idRoom = localStorage.getItem('idRoom');


  ngOnInit() {

    this.fetchRoomPlayers();
  }

  fetchRoomPlayers() {
    this._gameService.getPlayersRoom(this.idRoom).subscribe((data: any) => {
      this.roomPlayers = data.playersRoom;
      this.fetchAllPlayers();

    })
  }

  fetchAllPlayers() {
    this._gameService.getAllPlayers().subscribe(async (users: any) => {
      this.registeredUsers = await users;

      this.roomPlayers.forEach((data) => {

        this.registeredUsers.forEach((element, index) => {

          if (element.uid === data.player_id) {

            this.registeredUsers.splice(index, 1);
          }
        })

      });


    });
  }


  dimiss() {
    this.viewCtrl.dismiss();
  }

  onSelectedPlayer(user) {
    this.viewCtrl.dismiss({
      user
    })
  }

}
