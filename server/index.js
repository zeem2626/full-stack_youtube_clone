import dbConnect from "./db/index.js";
import app from "./app.js";


const port = process.env.PORT || 8800;

dbConnect()
   .then(() => {
      try {
         app.listen(port, () => {
            console.log("Server connected !!, PORT:", port);
         });
      } catch (error) {
         console.log("Server Connecting Error !!!");
         throw error;
      }
   })
   .catch((error) => {
      console.log("MONGO Connection Error !!");
      throw error;
   });
