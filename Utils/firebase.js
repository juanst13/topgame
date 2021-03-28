import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAJ5U3iun1TUxTDG2FELohksz8j7hT6UkU",
  authDomain: "games-b65cf.firebaseapp.com",
  projectId: "games-b65cf",
  storageBucket: "games-b65cf.appspot.com",
  messagingSenderId: "444216927434",
  appId: "1:444216927434:web:d0daac1702d752e291c033"
}
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig)