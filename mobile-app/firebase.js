import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBbzL4mp8kqzxCmMZXNQTFBkDW2R1XouoU",
    authDomain: "iotproject-c5714.firebaseapp.com",
    databaseURL: "https://iotproject-c5714-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "iotproject-c5714",
    storageBucket: "iotproject-c5714.appspot.com",
    messagingSenderId: "537040316343",
    appId: "1:537040316343:web:3b814a2aedcf96f7302a32",
    measurementId: "G-ST52TNPFPL",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;