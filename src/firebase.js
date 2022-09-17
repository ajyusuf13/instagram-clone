import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyApFoIk5rYqGlguSOG-lBZUWpNnODV6QC0",
    authDomain: "instagram-clone-5c568.firebaseapp.com",
    projectId: "instagram-clone-5c568",
    storageBucket: "instagram-clone-5c568.appspot.com",
    messagingSenderId: "567336949864",
    appId: "1:567336949864:web:84a7ee408b13020c7403dd"
  });

  const db = firebaseApp.firestore();
  const storage = firebase.storage();
  const auth = firebase.auth();
  
  
  export {db, auth, storage};