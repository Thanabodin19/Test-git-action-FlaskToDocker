import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing enviroment variable: MONGODB_URI.");
    }
    console.log();
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    if (connection.readyState === 1) {
      // console.log("Connected to MongoDB successfully");
      return Promise.resolve(true);
    }
  } catch (error) {
    // console.log(`Error connecting to MongoDB: ${error}`);
    return Promise.reject(error);
  }
};
