import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "./config/database";
import lockersRouter from "./routes/lockers";
import authRouter from "./routes/auth";
import 'pretty-error/start';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (process.env.NODE_ENV) {
  const envConfig = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  if (envConfig.error) {
    console.warn(`Warning: .env.${process.env.NODE_ENV} file not found`);
  }
}

connection();

const app: Application = express();

// // app.use(express.json());
app.use(cookieParser()); // Ajoutez cette ligne pour gérer les cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // URL de votre front-end
  credentials: true, // Permettre l'envoi de cookies
}));


app.use("/api/lockers", lockersRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "Hello World" }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
