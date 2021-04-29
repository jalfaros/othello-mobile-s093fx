import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor( public fireAuth: AngularFireAuth ) { 

   }



  localSignIn( {email, password} ){

    console.log(this.fireAuth.signInWithEmailAndPassword(email, password).then( user => {
      return user
    }))
  }
}
