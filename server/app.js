import express, { urlencoded } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import videoRoutes from "./routes/video.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();
console.log(process.env.FRONTEND_URL);

app.use(
   cors({
      origin: [
        "https://zeem-youtube-tawny.vercel.app",
         process.env.FRONTEND_URL,
         "http://localhost:4173",
         "http://localhost:5173",
      ],
      credentials: true,
   })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use((err, req, res, next) => {
   next(err);
});
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);

export default app;
