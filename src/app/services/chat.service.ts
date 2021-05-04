import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs: AngularFirestore) { }
  user = JSON.parse(localStorage.getItem('user'))


  addMessageChat(roomId, message) {

    console.log( 'servicio',this.user.uid )

    return this.afs.collection('messages').add({
      uidPlayer: this.user.uid,
      displayName: this.user.displayName,
      roomId: roomId,
      message: message,
      messageTime: firebase.default.firestore.FieldValue.serverTimestamp()
    })
  }


  getMessagesChat(){
    return this.afs.collection('messages', ref => ref.orderBy('messageTime','asc')).valueChanges()
  }


}
