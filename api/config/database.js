const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("successfully connected to database");
  } catch (error) {
    console.log("error : ", error);
    process.exit(1);
  }
};

module.exports = connection;
