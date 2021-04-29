import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor( public fireAuth: AngularFireAuth ) { 

   }



  localSignIn( {email, password} ) {

    try{
      return this.fireAuth.signInWithEmailAndPassword(email, password).then( response => {
        return response['user']
      }).catch( error => error)
    }catch( error ){
      console.log( error )
    }
  }

  googleSignIn(){
    try{
      return this.fireAuth.signInWithPopup( new firebase.default.auth.GoogleAuthProvider ).then( response => response['user'])
        .catch( error =>  error);
    }catch( error ){
      console.log( error )
    }
  }



}
