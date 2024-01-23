import mongoose, { mongo } from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO MONGODB".bgGreen.white);
  } catch (error) {
    console.log(`ERROR IN MONGODB ${error}`.bgRed.white);
  }
};

export default connectDB;
