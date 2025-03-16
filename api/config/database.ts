import mongoose from "mongoose";

const connection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Successfully connected to database");
  } catch (error) {
    console.error("Error: ", (error as Error).message);
    process.exit(1);
  }
};

export default connection;
