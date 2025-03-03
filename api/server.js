const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./config/database");

dotenv.config();
connection();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/lockers", require("./routes/lockers"));

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
