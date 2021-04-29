import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameCreaterService {


  BASE_URL = 'https://reversi-backend.herokuapp.com';
  LOCAL_URL = 'localhost:4200';
  user = JSON.parse(localStorage.getItem('user'))

  constructor(private http: HttpClient) { }

  getPlayerGames(  ) {
    return this.http.get(`${this.BASE_URL}/getPlayerGames?playerId=${this.user.uid}`)
      .pipe(map(res => res['games']));
  }


  createGame() {
    return this.http.get(`${this.BASE_URL}/newGame?createdBy=${this.user.uid}`)
      .pipe(map(res => res ));
  }


}
