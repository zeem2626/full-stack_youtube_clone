import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import conf from "../../conf/conf.js";

const firebaseConfig = {
   apiKey: conf.VITE_FIREBASE_API_KEY,
   authDomain: conf.VITE_FIREBASE_AUTH_DOMAIN,
   projectId: conf.VITE_FIREBASE_PROJECT_ID,
   storageBucket: conf.VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: conf.VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: conf.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();

export { auth, storage };
