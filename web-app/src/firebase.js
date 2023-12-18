import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const app = firebase.initializeApp(
    {
        apiKey: "AIzaSyBbzL4mp8kqzxCmMZXNQTFBkDW2R1XouoU",
        authDomain: "iotproject-c5714.firebaseapp.com",
        databaseURL: "https://iotproject-c5714-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "iotproject-c5714",
        storageBucket: "iotproject-c5714.appspot.com",
        messagingSenderId: "537040316343",
        appId: "1:537040316343:web:3b814a2aedcf96f7302a32",
        measurementId: "G-ST52TNPFPL"
    }
)

export const auth = app.auth();
export const database = firebase.database();
export const firestore = firebase.firestore(); // Export Firestore instance
export const googleProvider = new GoogleAuthProvider();
export default app;