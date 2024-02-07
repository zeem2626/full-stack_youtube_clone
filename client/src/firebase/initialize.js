import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import conf from "../../conf/conf.js";

const firebaseConfig = {
   apiKey: conf.firebaseApiKey,
   authDomain: conf.firebaseAuthDomain,
   projectId: conf.firebaseProjectId,
   storageBucket: conf.firebaseStorageBucket,
   messagingSenderId: conf.firebaseMessagingSenderId,
   appId: conf.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();

export { auth, storage };
