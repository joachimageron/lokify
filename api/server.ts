import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/database";
import lockersRouter from "./routes/lockers";

dotenv.config();
connection();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/lockers", lockersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
