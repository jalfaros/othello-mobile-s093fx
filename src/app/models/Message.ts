

export interface Message {
    uidPlayer: string,
    roomIdChat: string,
    message: string,
    messageTime: firebase.default.firestore.FieldValue
}