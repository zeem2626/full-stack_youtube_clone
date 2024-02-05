# full-stack_youtube Front-end Setup

This contains front-end part setup.
For detailed information about this project see [README](https://github.com/zeem2626/full-stack_youtube_clone#) of the root directory of this repository

**Requirements:**

-  Firebase account(Google Authentication and Storage Service)

**Setup:**

1. Clone the github repository, ignore if cloned already:

```bash
   https://github.com/zeem2626/full-stack_youtube_clone.git
```

2. Setup Backend [README](https://github.com/zeem2626/full-stack_youtube_clone/tree/main/server#readme), ignore if done already

3. Create _.env_ file in ___client___ directory

4. Copy all the environment variables from _.env.samle_ file to _.env_ file

5. Create Firebase account(ignore if you have already)

6. Create new project, initialize the SDK, and activate Google Authentication service(to signup and login from Google), and Storage service(to store videos and images)

7. Environment variables setup:

-  1. Go to project settings(General) then "Your apps" section and copy all the SDK configuration variables from the firebaseConfig and paste to ___client___'s .env file respectively

-  -  Example:
-  -  From _firebaseConfig_ -> apiKey: "keyValue"

-  -  To _.env_ file -> VITE_FIREBASE_API_KEY = "keyValue"

-  2. For _VITE_PROXY_ environment variable paste the the url where it's Backend is running

8. Open terminal in ___client___ directory

```bash
  /client$
```

9. Install dependencies

```bash
   /client$ npm install
```

10. Run Backend development server

```bash
   /server$ npm run dev
```

11. Run Frontend development server

```bash
   /client $ npm run dev
```

12. Open App in browser

-  [http://localhost:5173](http://localhost:5173)
-  If PORT: 5173 is busy, see PORT in terminal
