import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDiVwIDkDm056xEeoUUgRllnn3C1CDWNcI",
    authDomain: "pm-travel-41076.firebaseapp.com",
    projectId: "pm-travel-41076",
    storageBucket: "pm-travel-41076.appspot.com",
    messagingSenderId: "258677999281",
    appId: "1:258677999281:web:89c81d53c44594bdb08490"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  
  export const db = getFirestore(app);
  export const storage = getStorage(app);
  