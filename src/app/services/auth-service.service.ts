import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { GameCreaterService } from './game-creater.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})


export class AuthServiceService {

  constructor(
    public fireAuth: AngularFireAuth,
    private service: GameCreaterService,
    private router: Router,
    private toast: ToastController,
  ) { }

  createUser({ email, userName, password }) {

    this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user.updateProfile({
          displayName: userName
        });
        this.service.savePlayerInfo({ uid: user.user.uid, displayName: userName, email: user.user.email }).subscribe(
          p => {
            this.informationToast('Registrado con éxito!', 'success');
            this.router.navigate(['/login']);
          });

      }).catch(error => {
        this.informationToast(error.message, 'danger');

      });
  }

  localSignIn({ email, password }) {

    try {
      return this.fireAuth.signInWithEmailAndPassword(email, password).then(response => {
        return response['user']
      }).catch(error => error)
    } catch (error) {
      console.log(error)
    }
  }

  googleSignIn() {
    try {
      return this.fireAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider).then(response => response['user'])
        .catch(error => error);
    } catch (error) {
      console.log(error)
    }
  }

  async informationToast(message, toastType) {
    const toast = await this.toast.create({
      message: message,
      color: toastType,
      animated: true,
      duration: 2000
    });
    toast.present();
  }
  
}
