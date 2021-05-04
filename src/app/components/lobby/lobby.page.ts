import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { GameCreaterService } from '../../services/game-creater.service'
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
  rooms = [];
  selectedRoom;
  selectedUser = [];
  games = []; //Se guarda la lista de juegos de la sala


  ngOnInit() {
    this.getRooms();
  }

  async presentModal() {
    localStorage.setItem('idRoom', this.selectedRoom);
    const modal = await this.modalController.create({
      component: PlayersPage
    })
    modal.onDidDismiss().then((user: any) => {
      if (user.data !== undefined) {
        var user_selected = user['data']['user']
        this.selectedUser.push(user_selected);
      }

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

      if (!res['idGame']) {
        this.informationToast('Something went wrong creating the game!', 'danger');
        return;
      }
      this.informationToast('Game created succesfully', 'success')
      this.playerGames.push(res['idGame']);

    });
  }

  createRoom() {
    this._gameService.createRoom().subscribe(res => {

      if (!res['idRoom']) {
        this.informationToast('Something went wrong creating the room!', 'danger');
        return;
      } else {
        this.informationToast('Room created succesfully', 'success')
        this.rooms.push(res['idRoom']);

      }
    })

  }

  getRooms() {
    this._gameService.getRooms().subscribe((response: any) => {

      response.rooms.forEach(data => {
        this.rooms.push(data)
      })

    })
  }

  addUserRoom() {
    // this._gameService.addPlayerRoom({ idRoom: this.selectedRoom, uid: this.selectedUser.uid }).subscribe(res => {
    //   if (!res['success']) {
    //     this.informationToast('Something went wrong adding the user!', 'danger');
    //     return;

    //   } else {
    //     this.informationToast('User adding to room', 'success');
    //     this.deleteSelectedUser();
    //   }
    // })

    console.log(this.selectedUser);

  }

  // getAllGames() {
  //   this._gameService.getPlayerGames().subscribe(response => {
  //     this.playerGames = response;
  //   });
  // }

  onChangeRoom(event) {
    this._gameService.getGamesRooms(event.target.value).subscribe(({ gamesRoom }: any) => {
      this.games = gamesRoom;

      this.selectedUser = [];

    })
  }

  onMultiplayerClick() {
    this.presentModal();

  }

  deleteSelectedUser() {
    this.selectedUser = undefined;
  }







}
