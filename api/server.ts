import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "./config/database";
import lockersRouter from "./routes/lockers";
import authRouter from "./routes/auth";
import 'pretty-error/start';
import fs from 'fs';
import path from 'path';

// Load base environment variables first
dotenv.config({ path: '.env' });

// Then load NODE_ENV specific variables
if (process.env.NODE_ENV) {
  const envNodePath = `.env.${process.env.NODE_ENV}`;
  if (fs.existsSync(path.resolve(process.cwd(), envNodePath))) {
    dotenv.config({ path: envNodePath });
    console.log(`Loaded environment from ${envNodePath}`);
  } else {
    console.warn(`Warning: ${envNodePath} file not found`);
  }
}

// Finally, override with .env.local if it exists
const localEnvPath = '.env.local';
if (fs.existsSync(path.resolve(process.cwd(), localEnvPath))) {
  dotenv.config({ path: localEnvPath });
  console.log(`Loaded local environment overrides from ${localEnvPath}`);
}

connection();

const app: Application = express();

app.use(express.json()); // Uncommented this line for JSON parsing
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
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
