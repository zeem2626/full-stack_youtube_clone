const conf = {
   api: import.meta.env.VITE_SERVER_API,
   firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export default conf;
