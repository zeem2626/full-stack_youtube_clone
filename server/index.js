import dbConnect from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

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
