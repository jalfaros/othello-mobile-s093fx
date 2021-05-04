import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { GameCreaterService } from '../../services/game-creater.service'
import { ModalController } from '@ionic/angular'
import { PlayersPage } from './modalUser/players/players.page';
import { Game } from 'src/app/models/Game';

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
  playersRoom = [];
  rooms = [];
  selectedRoom;
  selectedPlayers = [];
  games = []; //Se guarda la lista de juegos de la sala
  selectedGame; //Juego que se elija en el select
  game; //Me guarda el juego completo que elija
  buttonJoin = false;//Para saber si hay segundo jugador
  addPlayer = false;
  selectedUser; //El usuario seleccionado para empezar un juego
  seePlayers: any; //Para ocultar la lista de amigos
  user = JSON.parse(localStorage.getItem('user'));


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
        this.selectedPlayers.push(user_selected);
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

  createRoom() {
    this._gameService.createRoom(this.user.uid).subscribe(res => {

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
    this._gameService.getRooms(this.user.uid).subscribe((response: any) => {

      response.rooms.forEach(data => {
        this.rooms.push(data)
      })

    })
  }

  addUserRoom() {

    const usersCollection = JSON.stringify(this.selectedPlayers);

    this._gameService.addPlayerRoom({ idRoom: this.selectedRoom, usersCollection }).subscribe(res => {

      if (!res['success']) {
        this.informationToast('Something went wrong adding the user!', 'danger');
        return;

      } else {
        this.informationToast('Adding users...', 'success');
        this.selectedPlayers = []
        this.informationToast('Users added sucessfully', 'success');
      }
    })
  }

  onChangeRoom(event) {
    this.getGamesRoom(event.target.value);
    this.selectedPlayers = [];
    this.getPlayersRoom();
  }

  getGamesRoom(params) {
    this._gameService.getGamesRooms(params).subscribe(({ gamesRoom }: any) => {

      this.games = gamesRoom;
      this.selectedPlayers = [];

    })
  }

  onChangeGame() {

    this._gameService.getInitialGame(this.selectedGame.idGame).subscribe((data: any) => {

      this.game = data.game;

      if (this.game.player2.playerId) { this.buttonJoin = true; this.addPlayer = false; }
      else { this.addPlayer = true; this.buttonJoin = false; };

      this.getPlayersRoom();
      console.log(this.game);

    });

  }

  onMultiplayerClick() {
    this.presentModal();

  }

  getPlayersRoom() {
    this._gameService.getPlayersRoom(this.selectedRoom).subscribe((data: any) => {
      this.playersRoom = data.playersRoom;
    });
  }

  deleteSelectedUser(userIndex) {
    this.selectedPlayers.splice(userIndex, 1)
  }


  addGameRoom() {
    this._gameService.createGame(this.user.uid).subscribe(res => {

      if (!res['idGame']) return;

      this.games.push(res['idGame']);

      this._gameService.addGameRoom(this.selectedRoom, res['idGame']).subscribe(data => {
        console.log(data);
        if (!data['success']) {
          this.informationToast('Something went wrong creating the game!', 'danger')

        } else {
          this.informationToast('Game created!', 'success');
          this.getGamesRoom(this.selectedRoom);

        }
      })
    });

  }

  startGame() {
    this._gameService.addSecondPlayer(this.selectedGame.idGame, this.selectedUser).subscribe(res => {
      if (!res['success']) return;

      this.buttonJoin = false;//Para saber si hay segundo jugador
      this.addPlayer = false;

    })
  }

  logOut() {
    localStorage.removeItem('user');
  }

  seeListFriends() {
    this.seePlayers = !this.seePlayers;
  }


}
