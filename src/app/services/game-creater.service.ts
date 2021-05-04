import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameCreaterService {


  BASE_URL = 'https://reversi-backend.herokuapp.com';
  LOCAL_URL = 'http://localhost:4000';
  user = JSON.parse(localStorage.getItem('user'))

  constructor(private http: HttpClient) { }

  getPlayerGames() {
    return this.http.get(`${this.BASE_URL}/getPlayerGames?playerId=${this.user.uid}`)
      .pipe(map(res => res['games']));
  }


  createGame() {
    return this.http.get(`${this.BASE_URL}/newGame?createdBy=${this.user.uid}`)
      .pipe(map(res => res));
  }

  /**
   * Función para guardar la información del usuario al registrarse
   * @param params 
   * @returns 
   */
  savePlayerInfo(params: any) {

    //params = JSON.stringify({ params })
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.LOCAL_URL}/savePlayerInformation`, { params }, { headers })
  }

  /**
   * Funcion para obtener el juego, vada ves que se vaya a la vista de board
   * @param idGame 
   * @returns 
   */
  getInitialGame(idGame) {
    return this.http.get(`${this.LOCAL_URL}/getGame?idGame=${idGame}`);
  }

  getAllPlayers() {
    return this.http.get(`${this.BASE_URL}/getAllPlayers`)
      .pipe(map(res => res['users']));
  }


  //------------------------------SERVICIOS DE LA SALA-----------------------------------
  /**
   * Endpoint para crear una nueva sala
   * @param params 
   */
  createRoom() {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.LOCAL_URL}/createRoom`, { params: { idOwner: this.user.uid } }, { headers })
  }

  /**
   * Endpoint para obtener las salas en las que se encuentra el usuario
   */
  getRooms() {
    return this.http.get(`${this.LOCAL_URL}/getRoomsForId?playerId=${this.user.uid}`)
  }

  /**
   * Endpoint para obtener los jugadores de una sala
   * @param param 
   * @returns 
   */

  getPlayersRoom(param) {
    return this.http.get(`${this.LOCAL_URL}/getGamersOfRoom?roomId=${param}`)
  }

  /**
   * Enpoint para agregar amigos a la sala
   * @param param 
   * @returns 
   */

  addPlayerRoom(param) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.LOCAL_URL}/addFriendRoom`, { params: param }, { headers })
  }


  /**
   * Enpoint para obtener los juegos  de la sala
   * @param param 
   * @returns 
   */
  getGamesRooms(param) {
    return this.http.get(`${this.LOCAL_URL}/getGamesOfRoom?roomId=${param}`)
  }

  /**
   * Funcion para agregar el id del juego creado a la sala
   * @param room 
   * @param game 
   * @returns 
   */
  addGameRoom(room, game) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.LOCAL_URL}/addGameRoom`, { params: { idRoom: room, idGame: game } }, { headers });
  }

}
