import firebase from 'firebase/app'
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCenhlaKulwXjMvUgDew8r3WkAORIQ8fqE",
    authDomain: "pchub-spm-project.firebaseapp.com",
    projectId: "pchub-spm-project",
    storageBucket: "pchub-spm-project.appspot.com",
    messagingSenderId: "1033915283450",
    appId: "1:1033915283450:web:1eca6d7e3c6d7b93225643"
  };

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export {storage, firebase as default};