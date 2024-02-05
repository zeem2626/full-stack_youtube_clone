# full-stack_youtube Back-end Setup

This README contains back-end part setup.
For detailed information about this project see [README](https://github.com/zeem2626/full-stack_youtube_clone#) of the root directory of this repository 


**Requirements:**

-  MongoDb Atlas account Or local MongoDb compass
   for database connection string

**Setup:**

1. Clone the github repository, ignore if cloned already:

```bash
   https://github.com/zeem2626/full-stack_youtube_clone.git
```

2. Create _.env_ file in ___server___ directory

3. Copy all the environment variables from _.env.samle_ file to _.env_ file

4. Setup environment variables in _.env_ file

-  Note the PORT from _.env_ file for Backend URL. Your 
Backend URL is _http ://localhost:{PORT}_, required for the _VITE_PROXY_ environment variable in ___client___'s _.env_ file.
-  If your PORT is _8800_ then URL is _http://localhost:8800_

5. Open terminal in ___server___ directory

```bash
  /server$
```

6. Install project dependencies

```bash
   /server$ npm install
```
7. Setup Frontend [README](https://github.com/zeem2626/full-stack_youtube_clone/tree/main/client#readme)

8. Run Backend development server

```bash
   /server$ npm run dev
```


9. Run Frontend development server

```bash
   /client$ npm run dev
```

10. Open App in browser

-  [http://localhost:5173](http://localhost:5173)
-  If PORT: 5173 is busy, see PORT in terminal
