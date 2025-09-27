import mongoose, { type ConnectOptions } from "mongoose";

const mongoUri: string = process.env.MONGO_URI || "";
const options: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri, options);
    console.log("Database connected");
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("DB connection error:", error.message);
    else console.error("Unknown DB error", error);
  }
};
export default connectDB;
