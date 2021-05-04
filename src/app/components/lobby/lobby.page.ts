import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { GameCreaterService } from '../../services/game-creater.service'
import { ModalController } from '@ionic/angular'
import { PlayersPage } from './modalUser/players/players.page';
import { ChatService } from 'src/app/services/chat.service';



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  constructor(private _gameService: GameCreaterService,
    private toast: ToastController,
    public modalController: ModalController,
    private _chatService : ChatService
  ) { }

  segmentModel = "settings";
  playersRoom = [];
  rooms = [];
  selectedRoom;
  selectedUser = [];
  games = [];
  selectedGame;
  game;
  buttonJoin = false;
  addPlayer = false;
  chatMessage = '';
  messages = []

  user = JSON.parse( localStorage.getItem('user') )


  ngOnInit() {
    this.getRooms();
    this.getMessages()
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


    var selectedPlayers = JSON.stringify(this.selectedUser)

    this._gameService.addPlayerRoom({ idRoom: this.selectedRoom, usersCollection: selectedPlayers }).subscribe(res => {
      if (!res['success']) {
        this.informationToast('Something went wrong adding the users!', 'danger');
        return;

      } else {
        this.selectedUser = [];
        this.informationToast('Users saved succesfully', 'success');
      }
    })


  }


  onChangeRoom(event) {
    this.getGamesRoom(event.target.value);
    this.selectedUser = [];

  }

  getGamesRoom(params) {
    this._gameService.getGamesRooms(params).subscribe(({ gamesRoom }: any) => {
      this.games = gamesRoom;

    })
  }

  onChangeGame(event) {

    this._gameService.getInitialGame(this.selectedGame.idGame).subscribe((data: any) => {


      this.game = data.game;

      if (this.game.player2.playerId) { this.buttonJoin = true }
      else { this.addPlayer = true };

      this._gameService.getPlayersRoom(this.selectedRoom).subscribe((data: any) => {
        this.playersRoom = data.playersRoom;

      });

    });

  }

  onMultiplayerClick() {
    this.presentModal();

  }

  deleteSelectedUser(i) {
    this.selectedUser.splice(i, 1);
  }


  addGameRoom() {

    this._gameService.createGame().subscribe(res => {
      if (!res['idGame']) return;

      this.games.push(res['idGame']);

      this._gameService.addGameRoom(this.selectedRoom, res['idGame']).subscribe(data => {

        if (!data['success']) {
          this.informationToast('Something went wrong creating the game!', 'danger')

        } else {
          this.informationToast('Game created succesfully!', 'success');
          this.getGamesRoom(this.selectedRoom);
        }

      })

    });

  }


  sendMessage(){

    if ( this.chatMessage.trim().length > 0 ){
      this._chatService.addMessageChat( this.selectedRoom, this.chatMessage ).then( res => {
        this.chatMessage = ''
      }).catch( err =>  {
        this.chatMessage = ''
      })
    }
  }

  getMessages(){
    this._chatService.getMessagesChat().subscribe( res => {
      this.messages = []
      for (const msg of res) {
        this.messages.unshift( msg )
      }
    })
  }







}
